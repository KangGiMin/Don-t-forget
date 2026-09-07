const fs = require('fs');
const path = require('path');

function getDirTree(dir, prefix = '') {
  let result = '';
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(item => !['node_modules', '.git', '.github', 'dist', 'build', '.env', 'package-lock.json'].includes(item.name));
  
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    result += `${prefix}${pointer}${item.name}\n`;
    
    if (item.isDirectory()) {
      const extension = isLast ? '    ' : '│   ';
      result += getDirTree(path.join(dir, item.name), prefix + extension);
    }
  });
  return result;
}

const treeStr = '```text\n.' + '\n' + getDirTree('.') + '```';
const readmePath = path.join(__dirname, 'README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

const startMarker = '<!-- START_TREE -->';
const endMarker = '<!-- END_TREE -->';
const startIndex = readmeContent.indexOf(startMarker);
const endIndex = readmeContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = readmeContent.substring(0, startIndex + startMarker.length) + '\n' + treeStr + '\n' + readmeContent.substring(endIndex);
  fs.writeFileSync(readmePath, newContent, 'utf8');
  console.log('README.md tree updated successfully!');
}