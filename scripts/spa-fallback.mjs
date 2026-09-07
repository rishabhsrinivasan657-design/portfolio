// GitHub Pages serves 404.html for unknown paths. Copying index.html there
// makes client-side routes (e.g. /projects/medbuddy) resolve on hard refresh.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');

if (!existsSync(index)) {
  console.error('spa-fallback: dist/index.html not found. Did the build run?');
  process.exit(1);
}

copyFileSync(index, join(dist, '404.html'));
// Stops GitHub Pages from running the output through Jekyll, which strips
// files and folders beginning with an underscore.
writeFileSync(join(dist, '.nojekyll'), '');

console.log('spa-fallback: wrote dist/404.html and dist/.nojekyll');
