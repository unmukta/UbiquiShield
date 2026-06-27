import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');

const ROOT_DIR = process.cwd();
const EXTENSION_DIR = path.join(ROOT_DIR, 'extension');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CHROME_DIR = path.join(DIST_DIR, 'chrome');
const EDGE_DIR = path.join(DIST_DIR, 'edge');
const FIREFOX_DIR = path.join(DIST_DIR, 'firefox');

// =========================
// HELPERS
// =========================

// Wipe and recreate the dist folder for a clean build every time
function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(CHROME_DIR, { recursive: true });
  fs.mkdirSync(EDGE_DIR, { recursive: true });
  fs.mkdirSync(FIREFOX_DIR, { recursive: true });
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Create a ZIP archive from a directory
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

// Create a ZIP from the project root, excluding bloat folders
function zipSourceCode(outPath, excludeDirs) {
  return new Promise((resolve, reject) => {
    const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);
    archive.on('error', err => reject(err));
    archive.pipe(stream);
    stream.on('close', () => resolve());

    // Walk the project root and add files, skipping excluded dirs
    function addDir(dir, archivePath) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = archivePath ? `${archivePath}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          if (excludeDirs.includes(entry.name)) continue;
          addDir(fullPath, relPath);
        } else {
          archive.file(fullPath, { name: relPath });
        }
      }
    }

    // Inject BUILD_INSTRUCTIONS.md for Mozilla reviewers
    const instructions = [
      '# Build Instructions for Mozilla Reviewers',
      '',
      '## Prerequisites',
      '- Node.js v18 or later',
      '- npm (included with Node.js)',
      '',
      '## Steps to Reproduce the Build',
      '',
      '### 1. Install popup UI dependencies',
      '```bash',
      'cd client',
      'npm install',
      '```',
      '',
      '### 2. Build the popup UI',
      '```bash',
      'npm run build',
      '```',
      'This compiles the React popup into `extension/assets/` and `extension/index.html`.',
      '',
      '### 3. Build the release packages (optional)',
      '```bash',
      'cd ..',
      'npm install',
      'npm run build',
      '```',
      'This generates the Chrome and Firefox ZIP packages in the `dist/` folder.',
      '',
      '## Project Structure',
      '- `extension/` — The raw extension files (background.js, content.js, injected.js, rules.json, manifest.json)',
      '- `client/` — React source for the popup UI (built with Vite)',
      '- `build.js` — Build script that generates browser-specific packages',
    ].join('\n');

    archive.append(instructions, { name: 'BUILD_INSTRUCTIONS.md' });

    addDir(ROOT_DIR, '');
    archive.finalize();
  });
}

// =========================
// BUILD PIPELINE
// =========================

async function build() {
  console.log('Cleaning dist/ folder...');
  cleanDist();

  // 1. Copy extension files to both browser directories
  console.log('Copying files to dist/chrome/...');
  copyDir(EXTENSION_DIR, CHROME_DIR);

  console.log('Copying files to dist/edge/...');
  copyDir(EXTENSION_DIR, EDGE_DIR);

  console.log('Copying files to dist/firefox/...');
  copyDir(EXTENSION_DIR, FIREFOX_DIR);

  // 2. Patch the Firefox manifest
  const firefoxManifestPath = path.join(FIREFOX_DIR, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(firefoxManifestPath, 'utf8'));

  console.log('Patching Firefox manifest.json...');

  // Replace service_worker with background scripts
  if (manifest.background && manifest.background.service_worker) {
    const scriptName = manifest.background.service_worker;
    delete manifest.background.service_worker;
    manifest.background.scripts = [scriptName];
  }

  // Add gecko ID, minimum version, and data collection declaration
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

  // 3. Read version from the Chrome manifest (unmodified)
  const chromeManifest = JSON.parse(fs.readFileSync(path.join(CHROME_DIR, 'manifest.json'), 'utf8'));
  const version = chromeManifest.version;

  // 4. Generate all three ZIP files
  const chromeZip = path.join(DIST_DIR, `UbiquiShield-Chrome-v${version}.zip`);
  const edgeZip = path.join(DIST_DIR, `UbiquiShield-Edge-v${version}.zip`);
  const firefoxZip = path.join(DIST_DIR, `UbiquiShield-Firefox-v${version}.zip`);
  const sourceZip = path.join(DIST_DIR, `UbiquiShield-Source-v${version}.zip`);

  console.log(`Zipping Chrome build...`);
  await zipDirectory(CHROME_DIR, chromeZip);

  console.log(`Zipping Edge build...`);
  await zipDirectory(EDGE_DIR, edgeZip);

  console.log(`Zipping Firefox build...`);
  await zipDirectory(FIREFOX_DIR, firefoxZip);

  console.log(`Zipping Source Code for Mozilla reviewers...`);
  await zipSourceCode(sourceZip, [
    'node_modules', '.git', 'dist', '.gemini', '.vscode'
  ]);

  // 5. Print summary
  console.log('\n========================================');
  console.log(`  UbiquiShield v${version} — Build Complete!`);
  console.log('========================================');
  console.log(`  Chrome : ${path.basename(chromeZip)}`);
  console.log(`  Edge   : ${path.basename(edgeZip)}`);
  console.log(`  Firefox: ${path.basename(firefoxZip)}`);
  console.log(`  Source : ${path.basename(sourceZip)}`);
  console.log('========================================\n');
}

build().catch(console.error);
