import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..');
const uiReport = '.vale/ui-labels.md';
const vale = process.env.VALE_BIN || 'vale';

const files = [
  ...markdownFiles(join(root, 'docs')),
  ...storyFiles(join(root, 'site')),
].map((file) => relative(root, file));

if (files.length === 0) {
  console.error('No prose files to lint.');
  process.exit(1);
}

let alerts = [];
try {
  alerts = runVale(files);
  const labels = collectUiLabels(join(root, 'site'));
  if (labels.length > 0) {
    writeFileSync(join(root, uiReport), `${labels.map((label) => label.text).join('\n\n')}\n`);
    const labelAlerts = runVale([uiReport]).map((alert) => {
      const source = labels[(alert.Line - 1) / 2];
      if (!source) return alert;
      return { ...alert, File: source.file, Line: lineOf(source.file, source.text) };
    });
    const labelKeys = new Set(labelAlerts.map((alert) => `${alert.Check}\t${alert.Match}`));
    alerts = alerts.filter((alert) => !(
      alert.File.startsWith('site/')
      && alert.Severity === 'warning'
      && labelKeys.has(`${alert.Check}\t${alert.Match}`)
    ));
    alerts = alerts.concat(labelAlerts);
  }
} finally {
  rmSync(join(root, uiReport), { force: true });
}

const errors = alerts.filter((alert) => alert.Severity === 'error');
const warnings = alerts.filter((alert) => alert.Severity === 'warning');
const report = formatReport(alerts, errors.length, warnings.length);
process.stdout.write(`${report}\n`);

if (process.env.GITHUB_STEP_SUMMARY) {
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`, { flag: 'a' });
}

process.exit(errors.length > 0 ? 1 : 0);

function displayPath(file) {
  const absolute = file.startsWith('/') ? file : join(root, file);
  return relative(root, absolute);
}

function markdownFiles(dir) {
  return walk(dir).filter((file) => file.endsWith('.md'));
}

function storyFiles(dir) {
  return walk(dir).filter((file) => /\.(html|md)$/.test(file));
}

function walk(dir, found = []) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return found;
    throw error;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, found);
    else found.push(path);
  }
  return found;
}

function collectUiLabels(dir) {
  const labels = [];
  for (const file of storyFiles(dir)) {
    const source = readFileSync(file, 'utf8')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    const texts = [];
    for (const tag of ['nav', 'button', 'label']) {
      const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
      for (const match of source.matchAll(pattern)) {
        const text = visibleText(match[1]);
        if (text) texts.push(text);
      }
    }
    const attributes = /\b(?:aria-label|placeholder|alt)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    for (const match of source.matchAll(attributes)) {
      const text = decode(match[1] ?? match[2] ?? '').replace(/\s+/g, ' ').trim();
      if (text) texts.push(text);
    }
    for (const text of texts) labels.push({ file: relative(root, file), text });
  }
  return labels;
}

function lineOf(file, text) {
  const lines = readFileSync(join(root, file), 'utf8').split('\n');
  const needle = text.slice(0, 80);
  const index = lines.findIndex((line) => line.includes(needle));
  return index === -1 ? 1 : index + 1;
}

function visibleText(html) {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function decode(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function runVale(paths) {
  const result = spawnSync(vale, [
    '--config', join(root, '.vale.ini'),
    '--output=JSON',
    '--no-exit',
    '--no-global',
    '--no-color',
    ...paths,
  ], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    console.error(result.error.code === 'ENOENT'
      ? 'vale is not installed.'
      : result.error.message);
    process.exit(1);
  }
  if (result.status !== 0 && result.status !== null) {
    if (result.stderr) process.stderr.write(result.stderr);
    console.error(`vale exited ${result.status}.`);
    process.exit(1);
  }

  const raw = result.stdout.trim();
  if (!raw) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(raw);
    console.error('vale did not return JSON.');
    process.exit(1);
  }

  const alerts = [];
  for (const [file, items] of Object.entries(parsed)) {
    for (const item of items) {
      alerts.push({ ...item, File: displayPath(file) });
    }
  }
  return alerts;
}

function formatReport(alerts, errorCount, warningCount) {
  const lines = [
    '# Prose findings',
    '',
    `${alerts.length} total. ${plural(errorCount, 'error')}. ${plural(warningCount, 'warning')}.`,
    '',
    'Errors fail the pull request. Warnings do not.',
    '',
    '## By rule',
    '',
    '| Severity | Rule | Count |',
    '| --- | --- | ---: |',
  ];

  for (const [key, count] of countBy(alerts, (alert) => `${alert.Severity}\t${alert.Check}`)) {
    const [severity, rule] = key.split('\t');
    lines.push(`| ${severity} | ${rule} | ${count} |`);
  }

  lines.push('', '## By file', '', '| File | Errors | Warnings |', '| --- | ---: | ---: |');
  const byFile = new Map();
  for (const alert of alerts) {
    const row = byFile.get(alert.File) ?? { errors: 0, warnings: 0 };
    if (alert.Severity === 'error') row.errors += 1;
    else if (alert.Severity === 'warning') row.warnings += 1;
    byFile.set(alert.File, row);
  }
  for (const [file, row] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`| ${file} | ${row.errors} | ${row.warnings} |`);
  }

  lines.push('', '## Findings', '');
  const ordered = [...alerts].sort((a, b) => (
    a.File.localeCompare(b.File) || a.Line - b.Line || a.Check.localeCompare(b.Check)
  ));
  if (ordered.length === 0) lines.push('None.');
  for (const alert of ordered) {
    const match = (alert.Match ?? '').replace(/\s+/g, ' ').trim();
    const clipped = match.length > 120 ? `${match.slice(0, 117)}...` : match;
    lines.push(`- ${alert.File}:${alert.Line} ${alert.Severity} ${alert.Check}: ${alert.Message}${clipped ? ` \`${clipped}\`` : ''}`);
  }

  return lines.join('\n');
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function countBy(alerts, keyFn) {
  const counts = new Map();
  for (const alert of alerts) {
    const key = keyFn(alert);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
