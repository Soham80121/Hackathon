const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['src/components', 'src/pages', 'src/layouts'];
const ROOT = path.join(__dirname, '.');

const REPLACEMENTS = [
  { pattern: /bg-white(?!\s+dark:)/g, replacement: 'bg-white dark:bg-slate-900' },
  { pattern: /bg-slate-50(?!\s+dark:)/g, replacement: 'bg-slate-50 dark:bg-slate-900/50' },
  { pattern: /bg-gray-50(?!\s+dark:)/g, replacement: 'bg-gray-50 dark:bg-slate-900/50' },
  { pattern: /bg-slate-100(?!\s+dark:)/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { pattern: /bg-gray-100(?!\s+dark:)/g, replacement: 'bg-gray-100 dark:bg-slate-800' },
  
  { pattern: /text-slate-900(?!\s+dark:)/g, replacement: 'text-slate-900 dark:text-white' },
  { pattern: /text-slate-800(?!\s+dark:)/g, replacement: 'text-slate-800 dark:text-white' },
  { pattern: /text-gray-900(?!\s+dark:)/g, replacement: 'text-gray-900 dark:text-white' },
  { pattern: /text-gray-800(?!\s+dark:)/g, replacement: 'text-gray-800 dark:text-white' },
  { pattern: /text-slate-700(?!\s+dark:)/g, replacement: 'text-slate-700 dark:text-gray-200' },
  { pattern: /text-gray-700(?!\s+dark:)/g, replacement: 'text-gray-700 dark:text-gray-200' },
  { pattern: /text-slate-600(?!\s+dark:)/g, replacement: 'text-slate-600 dark:text-gray-400' },
  { pattern: /text-gray-600(?!\s+dark:)/g, replacement: 'text-gray-600 dark:text-gray-400' },
  { pattern: /text-slate-500(?!\s+dark:)/g, replacement: 'text-slate-500 dark:text-gray-400' },
  { pattern: /text-gray-500(?!\s+dark:)/g, replacement: 'text-gray-500 dark:text-gray-400' },
  
  { pattern: /border-slate-200(?!\s+dark:)/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { pattern: /border-gray-200(?!\s+dark:)/g, replacement: 'border-gray-200 dark:border-slate-800' },
  { pattern: /border-slate-100(?!\s+dark:)/g, replacement: 'border-slate-100 dark:border-slate-800' },
  { pattern: /border-gray-100(?!\s+dark:)/g, replacement: 'border-gray-100 dark:border-slate-800' },
  { pattern: /border-slate-300(?!\s+dark:)/g, replacement: 'border-slate-300 dark:border-slate-700' },
  { pattern: /border-gray-300(?!\s+dark:)/g, replacement: 'border-gray-300 dark:border-slate-700' },
  
  { pattern: /hover:bg-slate-50(?!\s+dark:)/g, replacement: 'hover:bg-slate-50 dark:hover:bg-slate-800' },
  { pattern: /hover:bg-gray-50(?!\s+dark:)/g, replacement: 'hover:bg-gray-50 dark:hover:bg-slate-800' },
  { pattern: /hover:bg-slate-100(?!\s+dark:)/g, replacement: 'hover:bg-slate-100 dark:hover:bg-slate-800' },
  { pattern: /hover:bg-gray-100(?!\s+dark:)/g, replacement: 'hover:bg-gray-100 dark:hover:bg-slate-800' },
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
          content = content.replace(pattern, replacement);
          modified = true;
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

console.log('Dark mode classes applied successfully.');
