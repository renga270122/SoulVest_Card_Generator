const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'web');

const filesToCopy = [
  'index.html',
  'app.html',
  'app.js',
  'manifest.json',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png',
  'icon-192-v2.png',
  'icon-512-v2.png',
  'icon.svg',
  'soulvest_logo.png',
  'dhoni.jfif',
  'rajini.jfif',
  'sachin.jfif',
  'robots.txt',
  'sitemap.xml',
  'CNAME'
];

function ensureCleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyFileRelative(relativePath) {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(outputDir, relativePath);

  if (!fs.existsSync(source)) {
    return;
  }

  const targetDir = path.dirname(target);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(source, target);
}

ensureCleanDir(outputDir);
filesToCopy.forEach(copyFileRelative);

console.log(`Prepared web assets in ${outputDir}`);
