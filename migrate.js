const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'C:\\Users\\ASUS\\OneDrive\\Documents\\Growthory';
const targetDir = 'C:\\Users\\ASUS\\Downloads\\growthory\\Growthory';

function copyRecursiveSync(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (path.basename(src) === 'node_modules' || path.basename(src) === '.next' || path.basename(src) === '.git') {
            return;
        }
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log("Copying MongoDB migration from OneDrive...");
copyRecursiveSync(sourceDir, targetDir);

console.log("Deleting old Supabase files...");
const filesToDelete = [
    'client/lib/supabaseClient.js',
    'server/src/config/supabase.js',
    'server/src/utils/userSync.js',
    'server/sql'
];

filesToDelete.forEach(f => {
    const p = path.join(targetDir, f);
    if (fs.existsSync(p)) {
        if (fs.statSync(p).isDirectory()) {
            fs.rmSync(p, { recursive: true, force: true });
        } else {
            fs.unlinkSync(p);
        }
    }
});

console.log("Installing missing server dependencies (mongoose, bcryptjs, jsonwebtoken, etc)...");
execSync('npm install mongoose bcryptjs jsonwebtoken cookie-parser', { cwd: path.join(targetDir, 'server'), stdio: 'inherit' });

console.log("Installing missing client dependencies (js-cookie, etc)...");
execSync('npm install js-cookie jsonwebtoken', { cwd: path.join(targetDir, 'client'), stdio: 'inherit' });
execSync('npm uninstall @supabase/supabase-js', { cwd: path.join(targetDir, 'client'), stdio: 'inherit' });
execSync('npm uninstall @supabase/supabase-js', { cwd: path.join(targetDir, 'server'), stdio: 'inherit' });

console.log("Done!");
