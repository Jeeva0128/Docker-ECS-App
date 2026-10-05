const fs = require('fs');
const path = require('path');

function replaceAll(file) {
  const p = path.join('frontend', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  // Clean up all the messed up action lines
  content = content.replace(/action=\{<Button.*?Clear Filters<\/Button>\}[\s\S]*?\}\}/g, 'action={<Button onClick={() => setFilters({ page: 1, limit: 12 })}>Clear Filters</Button>}');
  
  // Apply other missing fixes to the reverted-ish state just in case
  content = content.replace(/variant:\s*['"]destructive['"]/g, 'variant: "error"');
  content = content.replace(/selectedTask\.id/g, 'selectedTask._id');
  content = content.replace(/selectedTask\?\.id/g, 'selectedTask?._id');
  content = content.replace(/label=["']Previous["']/g, '');
  content = content.replace(/label=["']Next["']/g, '');

  fs.writeFileSync(p, content);
}

replaceAll('src/app/(dashboard)/dashboard/tasks/page.tsx');
