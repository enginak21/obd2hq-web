const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outputDir = path.join(root, 'dist', 'cpanel-standalone');
const standaloneDir = path.join(root, '.next', 'standalone');
const staticDir = path.join(root, '.next', 'static');
const publicDir = path.join(root, 'public');

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required directory: ${source}`);
  }

  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function removeDirectory(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

removeDirectory(outputDir);
fs.mkdirSync(outputDir, { recursive: true });

copyDirectory(standaloneDir, outputDir);
copyDirectory(staticDir, path.join(outputDir, '.next', 'static'));
copyDirectory(publicDir, path.join(outputDir, 'public'));

const readme = [
  'OBD2HQ cPanel Node.js deployment package',
  '',
  '1. Upload every file in this folder to the cPanel Node.js application root.',
  '2. In cPanel Setup Node.js App, use Node.js 20 or newer.',
  '3. Set Application startup file to server.js.',
  '4. Set NODE_ENV=production.',
  '5. Let cPanel provide PORT. Do not hard-code it.',
  '6. Start or restart the Node.js application.',
  '7. Confirm https://www.obd2hq.com/en, /sitemap.xml and /robots.txt return 200.',
  '',
  'Do not upload this folder as a static public_html-only website.',
  'This project needs the Node.js runtime for routes, middleware, redirects and sitemap handling.',
  '',
].join('\n');

fs.writeFileSync(path.join(outputDir, 'README-CPANEL.txt'), readme);

console.log(`cPanel standalone package created at: ${outputDir}`);
