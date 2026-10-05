const fs = require('fs');
const path = require('path');

function regexReplace(file, regex, replaceStr) {
  const p = path.join('frontend', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(regex, replaceStr);
  fs.writeFileSync(p, content);
}

// Fix ErrorState props in dashboard/page.tsx
regexReplace('src/app/(dashboard)/dashboard/page.tsx', /message=\{error\}/g, 'description={error}');

// Fix "label" doesn't exist in tasks/page.tsx
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /<span label="Next" \/>/g, '<span>Next</span>');
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /<span label="Previous" \/>/g, '<span>Previous</span>');
// Actually, let's just make it simple: remove `label="Next"` if it's there
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /label=["']Previous["']/g, '');
regexReplace('src/app/(dashboard)/dashboard/tasks/page.tsx', /label=["']Next["']/g, '');

// Fix Variants in page.tsx
// Let's just remove the `Variants` type declaration and let it be inferred
regexReplace('src/app/page.tsx', /const itemVariants: Variants =/g, 'const itemVariants: any =');
regexReplace('src/app/page.tsx', /import \{ motion, Variants \}/g, 'import { motion }');
regexReplace('src/app/page.tsx', /ease: "easeOut"/g, 'ease: "easeOut" as any');
regexReplace('src/components/empty-state.tsx', /ease: "easeOut"/g, 'ease: "easeOut" as any');
