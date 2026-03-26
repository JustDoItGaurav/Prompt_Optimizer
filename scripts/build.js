const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '..', 'src', 'bookmarklet.js');
const distFile = path.join(__dirname, '..', 'dist', 'bookmarklet.js');
const rawDistFile = path.join(__dirname, '..', 'dist', 'raw.js');

try {
    console.log('Bundling via esbuild...');
    
    // Using npx allows us to run esbuild without explicitly installing it into a huge node_modules
    execSync(`npx --yes esbuild "${srcFile}" --bundle --format=iife --minify --outfile="${rawDistFile}"`, { stdio: 'inherit' });


    console.log('Wrapping in bookmarklet IIFE...');
    const rawContent = fs.readFileSync(rawDistFile, 'utf8');

    // Make it ultra-safe for URI inclusion
    const escapedContent = encodeURIComponent(`(function(){ ${rawContent} })();`);
    
    const bookmarkletHTML = `javascript:${escapedContent}`;
    
    fs.writeFileSync(distFile, bookmarkletHTML, 'utf8');
    
    console.log('=============================');
    console.log('✅ Bookmarklet generated successfully!');
    console.log(`Path: ${distFile}`);
    console.log('You can find the raw bundled JS in dist/raw.js for debugging.');
    console.log('=============================');

} catch (e) {
    console.error('Build failed: ', e);
    process.exit(1);
}
