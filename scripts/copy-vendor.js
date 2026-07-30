import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const lucideSrc = path.join(root, 'node_modules', 'lucide', 'dist', 'umd', 'lucide.min.js');
const lucideDest = path.join(root, 'public', 'vendor', 'lucide.min.js');

if (fs.existsSync(lucideSrc)) {
  copyFile(lucideSrc, lucideDest);
  console.log('Copied lucide.min.js to public/vendor/');
} else {
  console.warn('Lucide not installed yet, skipping vendor copy.');
}

const flagsSrc = path.join(root, 'node_modules', 'flag-icons');
const flagsDest = path.join(root, 'public', 'vendor', 'flag-icons');

if (fs.existsSync(flagsSrc)) {
  copyDir(flagsSrc, flagsDest);
  console.log('Copied flag-icons to public/vendor/flag-icons/');
} else {
  console.warn('flag-icons not installed yet, skipping flag copy.');
}
