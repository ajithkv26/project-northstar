import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';

const root = join(import.meta.dirname, '..');
const configPath = join(root, 'budget.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

if (!Array.isArray(config.pages) || config.pages.length === 0) {
  console.error('budget.config.json needs a pages array.');
  process.exit(1);
}

function isInside(parent, child) {
  const base = normalize(parent + sep);
  const target = normalize(child);
  return target === normalize(parent) || target.startsWith(base);
}

const textExtensions = new Set(['.html', '.css', '.svg']);
const attrPattern = /\b(?:href|src|poster)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const srcsetPattern = /\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const cssUrlPattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)"'\s]+))\s*\)/gi;

function referencesFrom(text, pattern) {
  const found = [];
  const expression = new RegExp(pattern.source, pattern.flags);
  for (const match of text.matchAll(expression)) {
    found.push(match[1] ?? match[2] ?? match[3] ?? '');
  }
  return found;
}

function rejectExternal(value, from) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !value.startsWith('data:')) {
    throw new Error(`External reference is outside the transfer budget (${from}): ${value}`);
  }
}

function localPath(raw, fromFile) {
  const value = raw.trim();
  if (!value || value.startsWith('#') || value.startsWith('data:')) return null;
  rejectExternal(value, fromFile);
  if (value.startsWith('/')) {
    throw new Error(`Root-relative reference is outside the built page (${fromFile}): ${value}`);
  }
  const path = value.split('#')[0].split('?')[0];
  if (!path) return null;
  return path;
}

function collect(file, seen, dist) {
  const absolute = normalize(resolve(file));
  if (seen.has(absolute)) return;
  if (!isInside(dist, absolute)) {
    throw new Error(`Reference escapes dist/: ${absolute}`);
  }
  if (!existsSync(absolute)) {
    throw new Error(`Missing file in transfer budget: ${absolute}`);
  }
  seen.add(absolute);

  if (!textExtensions.has(extname(absolute))) return;

  const text = readFileSync(absolute, 'utf8');
  const base = dirname(absolute);
  const refs = [
    ...referencesFrom(text, attrPattern),
    ...referencesFrom(text, srcsetPattern).flatMap((srcset) => srcset.split(',').map((part) => part.trim().split(/\s+/)[0])),
    ...referencesFrom(text, cssUrlPattern),
  ];

  for (const ref of refs) {
    const relative = localPath(ref, absolute);
    if (!relative) continue;
    collect(join(base, relative), seen, dist);
  }
}

let failed = false;

for (const page of config.pages) {
  const entry = resolve(root, page.entry);
  const dist = resolve(root, 'dist');
  const seen = new Set();
  try {
    collect(entry, seen, dist);
  } catch (error) {
    console.error(`${page.name}: ${error.message}`);
    failed = true;
    continue;
  }

  let total = 0;
  for (const file of seen) total += statSync(file).size;
  const limit = page.maxTransferBytes;
  const status = `${page.name}: ${total} bytes / ${limit} bytes`;
  if (total > limit) {
    console.error(`${status} (over budget)`);
    failed = true;
  } else {
    console.log(status);
  }
}

if (failed) process.exit(1);
