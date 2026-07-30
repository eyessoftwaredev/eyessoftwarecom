import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const langs = ['en', 'tr', 'ar', 'de', 'fr'];
const bundle = {};

for (const lang of langs) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn('Missing locale file:', filePath);
    continue;
  }
  bundle[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const out = `window.__LOCALES__ = ${JSON.stringify(bundle)};\n`;
fs.writeFileSync(path.join(localesDir, 'bundle.js'), out);
console.log('Built public/locales/bundle.js');
