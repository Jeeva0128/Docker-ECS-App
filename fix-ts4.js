const fs = require('fs');
const path = require('path');

function regexReplace(file, regex, replaceStr) {
  const p = path.join('frontend', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(regex, replaceStr);
  fs.writeFileSync(p, content);
}

// Remove motion props completely
regexReplace('src/components/empty-state.tsx', /initial=\{\{[\s\S]*?\}\}/g, '');
regexReplace('src/components/empty-state.tsx', /animate=\{\{[\s\S]*?\}\}/g, '');
regexReplace('src/components/empty-state.tsx', /transition=\{\{[\s\S]*?\}\}/g, '');

// The action prop in tasks/page.tsx probably spans multiple lines
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /action=\{\{\s*label:\s*["']Clear Filters["'],\s*onClick:\s*[^\}]+\s*\}\}/g, 'action={<button onClick={() => setFilters({})}>Clear Filters</button>}');

