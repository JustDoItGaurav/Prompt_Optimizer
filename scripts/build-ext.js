const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist', 'extension');

// Ensure dist dir exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

try {
    console.log('Building Chrome Extension via esbuild...');

    // We have three main entry points for the extension now
    // 1. background.js
    // 2. content.js
    // 3. popup/popup.js

    const entries = [
        path.join(srcDir, 'background.js'),
        path.join(srcDir, 'content.js'),
        path.join(srcDir, 'popup', 'popup.js')
    ];

    // Filter out missing files if they aren't created yet during the migration
    const validEntries = entries.filter(f => fs.existsSync(f));

    if (validEntries.length > 0) {
        // We use --outdir for multiple entry points
        execSync(`npx --yes esbuild ${validEntries.map(e => `"${e}"`).join(' ')} --bundle --format=iife --outdir="${distDir}"`, { stdio: 'inherit' });
    }

    console.log('Copying static assets...');
    
    // Copy manifest.json
    fs.copyFileSync(path.join(srcDir, 'manifest.json'), path.join(distDir, 'manifest.json'));

    // Copy popup.html if it exists
    const popupDir = path.join(srcDir, 'popup');
    if (fs.existsSync(path.join(popupDir, 'popup.html'))) {
        const distPopupDir = path.join(distDir, 'popup');
        if (!fs.existsSync(distPopupDir)) fs.mkdirSync(distPopupDir, { recursive: true });
        fs.copyFileSync(path.join(popupDir, 'popup.html'), path.join(distPopupDir, 'popup.html'));
    }

    console.log('=============================');
    console.log('✅ Chrome Extension built successfully!');
    console.log(`Path: ${distDir}`);
    console.log('=============================');

} catch (e) {
    console.error('Build failed: ', e);
    process.exit(1);
}
