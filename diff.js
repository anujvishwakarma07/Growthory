const fs = require('fs');
const path = require('path');

const dir1 = 'C:\\Users\\ASUS\\OneDrive\\Documents\\Growthory';
const dir2 = 'C:\\Users\\ASUS\\Downloads\\growthory\\Growthory';

function walkSync(currentDirPath, callback) {
    if (!fs.existsSync(currentDirPath)) return;
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && name !== 'node_modules' && name !== '.next' && name !== '.git') {
            walkSync(filePath, callback);
        }
    });
}

const files1 = [];
walkSync(dir1, (fp) => files1.push(fp.replace(dir1, '')));

const files2 = [];
walkSync(dir2, (fp) => files2.push(fp.replace(dir2, '')));

const onlyIn1 = files1.filter(f => !files2.includes(f));
const onlyIn2 = files2.filter(f => !files1.includes(f));

console.log('Only in OneDrive:', onlyIn1);
console.log('Only in Downloads:', onlyIn2);
