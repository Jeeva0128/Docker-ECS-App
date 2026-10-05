const fs = require('fs');
const path = require('path');

function regexReplace(file, regex, replaceStr) {
  const p = path.join('frontend', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(regex, replaceStr);
  fs.writeFileSync(p, content);
}

// 1. login page
regexReplace('src/app/(auth)/login/page.tsx', /await login\(email, password\)/g, 'await login({ email, password })');

// 2. register page
regexReplace('src/app/(auth)/register/page.tsx', /await register\(name, email, password\)/g, 'await register({ name, email, password })');

// 3. dashboard page error state
regexReplace('src/app/(dashboard)/dashboard/page.tsx', /message=\{error\.message\}/g, 'description={error.message}');

// 4. tasks page task.id
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /selectedTask\.id/g, 'selectedTask._id');
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /selectedTask\?\.id/g, 'selectedTask?._id');

// 5. tasks page EmptyState action prop
// It probably looks like:
// action={{ label: "Clear Filters", onClick: clearFilters }}
// Let's replace it with a button
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /action=\{\{\s*label:\s*["']Clear Filters["'],\s*onClick:\s*clearFilters\s*\}\}/g, 'action={<button onClick={clearFilters}>Clear Filters</button>}');

// 6. empty-state.tsx motion div
regexReplace('src/components/empty-state.tsx', /<motion\.div/g, '<div');
regexReplace('src/components/empty-state.tsx', /<\/motion\.div>/g, '</div>');
regexReplace('src/components/empty-state.tsx', /initial=\{\{ opacity: 0, y: 10 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*transition=\{\{ duration: 0\.3, ease: "easeOut" as any \}\}/g, '');

