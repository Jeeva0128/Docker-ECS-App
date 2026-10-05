const fs = require('fs');
const path = require('path');

function replaceAll(file) {
  const p = path.join('frontend', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/action=\{\{[\s\S]*?\}\}/g, 'action={<Button onClick={() => setFilters({ page: 1, limit: 12 })}>Clear Filters</Button>}');
  // Also clean up the // I just added
  content = content.replace(/action={<Button.*?Clear Filters<\/Button>\} \/\//g, 'action={<Button onClick={() => setFilters({ page: 1, limit: 12 })}>Clear Filters</Button>}');
  fs.writeFileSync(p, content);
}

replaceAll('src/app/(dashboard)/dashboard/tasks/page.tsx');
