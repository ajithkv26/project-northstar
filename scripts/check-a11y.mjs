import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, normalize, sep } from 'node:path';
import axe from 'axe-core';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const entry = join(dist, 'index.html');
const expectedText = 'AJ Work Thinking Stories Notes I make complex products easier to build, use and evolve. Over the last decade I\'ve worked on enterprise platforms, internal tools and data-heavy products. I enjoy understanding how people work. I question assumptions. I design systems that make complex software feel simple. [ASK: one sentence on what you do now.] Explore My Work Good products aren\'t simple. They just feel simple. Stories Behind the Product How do you help hundreds of production partners work together without making the platform harder to use? Gelato I built internal platforms, workflows and design systems. They scaled with the business. They did not fight it. Onboarding got 78% and 90% faster. I am proud of the approach, not the UI. [ASK: what was the approach?] How do you help enterprise teams publish faster without sacrificing consistency? Dell I redesigned a complex publishing workflow. The change cut publishing time by 90%. [ASK: why was it right to ship this version first?] How do you make thousands of railway sensor readings understandable in seconds? CEMIT I design products that turn operational data into decisions people can trust. Things I Notice Users have to remember instead of recognize. Different teams solve the same problem differently. Teams add features. They do not question the underlying problem. People slowly accept complexity as "normal". Thinking I think long term, to save cost. [ASK: one real example.] Consistency isn\'t about making everything look the same. It\'s about making decisions predictable. Let\'s build better products. You are building software that gets harder to use as it grows. I\'d love to talk.';

if (!existsSync(entry)) {
  console.error('dist/index.html is missing. Run npm run build first.');
  process.exit(1);
}

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chromePath = chromeCandidates.find((path) => existsSync(path));
if (!chromePath) {
  console.error('Chrome was not found. Set CHROME_PATH to a Chrome or Chromium binary.');
  process.exit(1);
}

const axeSource = axe.source ?? axe.default?.source;
if (!axeSource) {
  console.error('axe-core did not expose its source bundle.');
  process.exit(1);
}

function isInside(parent, child) {
  const base = normalize(parent + sep);
  const target = normalize(child);
  return target === normalize(parent) || target.startsWith(base);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = normalize(join(dist, pathname));
  if (!isInside(dist, file)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = readFileSync(file);
    response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => {
  server.listen(0, '127.0.0.1', resolve);
});
const { port } = server.address();

let chrome;
let userDataDir;

function stopChrome() {
  if (!chrome?.pid) return;
  try {
    process.kill(-chrome.pid, 'SIGKILL');
  } catch {
    chrome.kill('SIGKILL');
  }
  chrome = undefined;
}

function reservePort() {
  return new Promise((resolve, reject) => {
    const probe = createNetServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port: debugPort } = probe.address();
      probe.close((error) => {
        if (error) reject(error);
        else resolve(debugPort);
      });
    });
  });
}

function launchChrome(debugPort, dataDir) {
  let output = '';
  const env = { ...process.env };
  // GitHub runners set a D-Bus address Chrome 155 cannot parse. It then
  // stalls before the DevTools port opens.
  delete env.DBUS_SESSION_BUS_ADDRESS;
  const child = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${debugPort}`,
    '--remote-debugging-address=127.0.0.1',
    '--remote-allow-origins=*',
    `--user-data-dir=${dataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
  ], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env,
  });
  const collect = (chunk) => {
    output += chunk.toString();
  };
  child.stdout.on('data', collect);
  child.stderr.on('data', collect);
  chrome = child;
  return () => output;
}

const timeout = setTimeout(() => {
  console.error('Accessibility check timed out.');
  stopChrome();
  server.close();
  process.exit(1);
}, 120000);

async function devtoolsUrl(debugPort, output, deadlineMs) {
  const started = Date.now();
  let logged = '';
  while (Date.now() - started < deadlineMs) {
    logged = output();
    const match = logged.match(/DevTools listening on (ws:\/\/\S+)/);
    if (match) return match[1];
    try {
      const version = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (version.ok) {
        const body = await version.json();
        if (body.webSocketDebuggerUrl) return body.webSocketDebuggerUrl;
      }
    } catch {
      // Chrome is still starting.
    }
    try {
      const portFile = await readFile(join(userDataDir, 'DevToolsActivePort'), 'utf8');
      const [filePort, filePath] = portFile.split('\n');
      if (filePort?.trim() && filePath?.trim()) {
        return `ws://127.0.0.1:${filePort.trim()}${filePath.trim()}`;
      }
    } catch {
      // The port file appears after the browser is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  const error = new Error(`Chrome did not open a DevTools port.\n${logged}`);
  error.logged = logged;
  throw error;
}

async function startChrome() {
  let lastLog = '';
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    if (userDataDir) await rm(userDataDir, { recursive: true, force: true });
    userDataDir = await mkdtemp(join(tmpdir(), 'northstar-chrome-'));
    const debugPort = await reservePort();
    const output = launchChrome(debugPort, userDataDir);
    try {
      return await devtoolsUrl(debugPort, output, 20000);
    } catch (error) {
      lastLog = error.logged ?? output();
      stopChrome();
      if (attempt === 2) break;
    }
  }
  throw new Error(`Chrome did not open a DevTools port.\n${lastLog}`);
}

function connect(url) {
  const ws = new WebSocket(url);
  const pending = new Map();
  let nextId = 1;

  const opened = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('DevTools socket failed to open.')), { once: true });
  });

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${message.error.message}`));
    else resolve(message);
  });

  function send(method, params, sessionId) {
    const id = nextId;
    nextId += 1;
    const payload = { id, method };
    if (params) payload.params = params;
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify(payload));
    });
  }

  return { ws, opened, send };
}

let failed = false;

try {
  const browserUrl = await startChrome();
  const devtools = connect(browserUrl);
  await devtools.opened;

  const created = await devtools.send('Target.createTarget', { url: 'about:blank' });
  const attached = await devtools.send('Target.attachToTarget', {
    targetId: created.result.targetId,
    flatten: true,
  });
  const sessionId = attached.result.sessionId;

  await devtools.send('Page.enable', undefined, sessionId);
  await devtools.send('Runtime.enable', undefined, sessionId);
  await devtools.send('Page.addScriptToEvaluateOnNewDocument', { source: axeSource }, sessionId);

  const cases = [
    { width: 320, height: 720, mobile: true, scheme: 'light' },
    { width: 1280, height: 800, mobile: false, scheme: 'light' },
    { width: 320, height: 720, mobile: true, scheme: 'dark' },
    { width: 1280, height: 800, mobile: false, scheme: 'dark' },
  ];

  for (const item of cases) {
    await devtools.send('Emulation.setDeviceMetricsOverride', {
      width: item.width,
      height: item.height,
      deviceScaleFactor: 1,
      mobile: item.mobile,
    }, sessionId);
    await devtools.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: item.scheme }],
    }, sessionId);

    const pageUrl = `http://127.0.0.1:${port}/`;
    await devtools.send('Page.navigate', { url: pageUrl }, sessionId);
    const started = Date.now();
    let ready = false;
    while (Date.now() - started < 10000) {
      const state = await devtools.send('Runtime.evaluate', {
        expression: 'document.readyState + " " + location.href',
        returnByValue: true,
      }, sessionId);
      if (state.result?.result?.value === `complete ${pageUrl}`) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    if (!ready) throw new Error(`Page did not load: ${pageUrl}`);

    const text = await devtools.send('Runtime.evaluate', {
      expression: "document.body.innerText.replace(/\\s+/g, ' ').trim()",
      returnByValue: true,
    }, sessionId);
    const visible = text.result?.result?.value;
    if (visible !== expectedText) {
      console.error(`Visible text at ${item.width}px ${item.scheme} is "${visible}". Expected "${expectedText}".`);
      failed = true;
    }

    const fit = await devtools.send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1',
      returnByValue: true,
    }, sessionId);
    if (fit.result?.result?.value !== true) {
      console.error(`Page overflows at ${item.width}px ${item.scheme}.`);
      failed = true;
    }

    const evaluated = await devtools.send('Runtime.evaluate', {
      expression: "axe.run(document, { resultTypes: ['violations', 'incomplete'] })",
      awaitPromise: true,
      returnByValue: true,
    }, sessionId);

    if (evaluated.result?.exceptionDetails) {
      throw new Error(`axe.run failed: ${evaluated.result.exceptionDetails.text}`);
    }

    const results = evaluated.result?.result?.value;
    if (!results) throw new Error('axe.run returned no result.');

    if (results.incomplete.length > 0) {
      console.log(`axe incomplete at ${item.width}px ${item.scheme} (not failing): ${results.incomplete.length}`);
      for (const incomplete of results.incomplete) {
        console.log(`  ${incomplete.id} (${incomplete.impact ?? 'unknown'})`);
      }
    }

    if (results.violations.length > 0) {
      failed = true;
      console.error(`axe violations at ${item.width}px ${item.scheme}: ${results.violations.length}`);
      for (const violation of results.violations) {
        console.error(`  ${violation.id} (${violation.impact}) ${violation.help}`);
        for (const node of violation.nodes) {
          console.error(`    ${node.target.join(' ')}`);
          console.error(`    ${node.failureSummary}`);
        }
      }
    }
  }

  devtools.ws.close();
  if (failed) {
    console.error(`axe failed (${chromePath})`);
    process.exitCode = 1;
  } else {
    console.log(`axe: 0 violations at 320px and 1280px, light and dark (${chromePath})`);
  }
} finally {
  clearTimeout(timeout);
  stopChrome();
  await new Promise((resolve) => server.close(resolve));
  if (userDataDir) await rm(userDataDir, { recursive: true, force: true });
}

if (process.exitCode) process.exit(process.exitCode);
