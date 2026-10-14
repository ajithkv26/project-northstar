import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const source = join(root, 'site');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await cp(source, dist, { recursive: true });
console.log('Built site/ to dist/.');
