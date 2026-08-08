const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['src/components', 'src/pages', 'src/layouts'];
const ROOT = path.join(__dirname, '.');

const REPLACEMENTS = [
  // Primary text replacements
  { pattern: /dark:text-white/g, replacement: 'dark:text-darktext-primary' },
  { pattern: /dark:text-slate-900/g, replacement: 'dark:text-darktext-primary' },
  { pattern: /dark:text-gray-900/g, replacement: 'dark:text-darktext-primary' },
  
  // Secondary text replacements
  { pattern: /dark:text-slate-200/g, replacement: 'dark:text-darktext-secondary' },
  { pattern: /dark:text-gray-200/g, replacement: 'dark:text-darktext-secondary' },
  { pattern: /dark:text-slate-300/g, replacement: 'dark:text-darktext-secondary' },
  { pattern: /dark:text-gray-300/g, replacement: 'dark:text-darktext-secondary' },
  
  // Muted text replacements
  { pattern: /dark:text-slate-400/g, replacement: 'dark:text-darktext-muted' },
  { pattern: /dark:text-gray-400/g, replacement: 'dark:text-darktext-muted' },
  { pattern: /dark:text-slate-500/g, replacement: 'dark:text-darktext-muted' },
  { pattern: /dark:text-gray-500/g, replacement: 'dark:text-darktext-muted' },

  // Add explicit dark text for inputs if missing
  { pattern: /className="(.*?)focus:outline-none(.*?)"/g, replacement: (match, p1, p2) => {
      if (match.includes('dark:text-darktext')) return match;
      return `className="${p1}focus:outline-none dark:text-darktext-primary${p2}"`;
  }}
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { pattern, replacement } of REPLACEMENTS) {
        if (pattern.test(content)) {
          if (typeof replacement === 'function') {
            const newContent = content.replace(pattern, replacement);
            if (newContent !== content) {
              content = newContent;
              modified = true;
            }
          } else {
            content = content.replace(pattern, replacement);
            modified = true;
          }
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

DIRECTORIES.forEach(dir => {
  const fullDirPath = path.join(ROOT, dir);
  if (fs.existsSync(fullDirPath)) {
    processDirectory(fullDirPath);
  }
});

console.log('Dark text classes applied successfully.');
