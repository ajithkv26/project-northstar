import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const html = await readFile(join(dist, 'index.html'), 'utf8');
const tokens = await readFile(join(dist, 'tokens.css'), 'utf8');
const styles = await readFile(join(dist, 'styles.css'), 'utf8');
const css = `${tokens}\n${styles}`.replace(/<\/style/gi, '<\\/style');

const linkBlock = '    <link rel="stylesheet" href="tokens.css">\n    <link rel="stylesheet" href="styles.css">\n';
if (!html.includes(linkBlock)) {
  console.error('dist/index.html is missing its stylesheet links. The preview file was not written.');
  process.exit(1);
}

const packed = html.replace(linkBlock, `    <style>\n${css}\n    </style>\n`);

const outDir = join(root, 'preview');
await mkdir(outDir, { recursive: true });
const out = join(outDir, 'northstar-preview.html');
await writeFile(out, packed);
console.log('Wrote preview/northstar-preview.html');
