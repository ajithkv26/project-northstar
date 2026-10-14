import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const jar = require('vnu-jar');
const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const preview = join(root, 'preview', 'northstar-preview.html');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html is missing. Run npm run build first.');
  process.exit(1);
}

// Documents only. dist/ also contains the font file, which the checker cannot parse.
const targets = [
  join(dist, 'index.html'),
  join(dist, 'styles.css'),
  join(dist, 'tokens.css'),
];
if (existsSync(preview)) targets.push(preview);

const result = spawnSync('java', [
  '-jar',
  jar,
  '--also-check-css',
  '--format',
  'gnu',
  ...targets,
], { encoding: 'utf8' });

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
