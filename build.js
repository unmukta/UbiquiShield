import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');

const ROOT_DIR = process.cwd();
const EXTENSION_DIR = path.join(ROOT_DIR, 'extension');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CHROME_DIR = path.join(DIST_DIR, 'chrome');
const FIREFOX_DIR = path.join(DIST_DIR, 'firefox');

// Ensure directories exist
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);
if (!fs.existsSync(CHROME_DIR)) fs.mkdirSync(CHROME_DIR, { recursive: true });
if (!fs.existsSync(FIREFOX_DIR)) fs.mkdirSync(FIREFOX_DIR, { recursive: true });

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy fresh extension files to both directories
console.log('Copying files to dist/chrome...');
copyDir(EXTENSION_DIR, CHROME_DIR);

console.log('Copying files to dist/firefox...');
copyDir(EXTENSION_DIR, FIREFOX_DIR);

// 2. Modify Firefox manifest
const firefoxManifestPath = path.join(FIREFOX_DIR, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(firefoxManifestPath, 'utf8'));

console.log('Patching Firefox manifest.json...');

// Fix Error 1: Use background scripts instead of service worker for MV3
if (manifest.background && manifest.background.service_worker) {
  const scriptName = manifest.background.service_worker;
  delete manifest.background.service_worker;
  manifest.background.scripts = [scriptName];
}

// Fix Error 2: Add browser_specific_settings with ID, bump min_version for DNR, and add data_collection_permissions
manifest.browser_specific_settings = {
  gecko: {
    id: 'ubiquishield@unmukta.com',
    strict_min_version: '113.0',
    data_collection_permissions: {
      required: ['none']
    }
  }
};

fs.writeFileSync(firefoxManifestPath, JSON.stringify(manifest, null, 2));

// 3. Zip both extensions
function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    archive.directory(sourceDir, false);
    archive.on('error', err => reject(err));
    archive.pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

async function build() {
  const version = manifest.version;
  const chromeZip = path.join(DIST_DIR, `UbiquiShield-Chrome-v${version}.zip`);
  const firefoxZip = path.join(DIST_DIR, `UbiquiShield-Firefox-v${version}.zip`);

  console.log(`Zipping Chrome build to ${chromeZip}...`);
  await zipDirectory(CHROME_DIR, chromeZip);

  console.log(`Zipping Firefox build to ${firefoxZip}...`);
  await zipDirectory(FIREFOX_DIR, firefoxZip);

  console.log('Build complete!');
}

build().catch(console.error);
