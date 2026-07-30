import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', 'lucide', 'dist', 'umd', 'lucide.min.js');
const destDir = path.join(root, 'public', 'vendor');
const dest = path.join(destDir, 'lucide.min.js');

if (!fs.existsSync(src)) {
  console.warn('Lucide not installed yet, skipping vendor copy.');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Copied lucide.min.js to public/vendor/');
