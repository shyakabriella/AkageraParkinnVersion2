import fs from 'fs';

const pages = ['home', 'gallery', 'experiences', 'offers', 'services'];

for (const page of pages) {
  const componentName = page.charAt(0).toUpperCase() + page.slice(1);
  const dir = `src/pages/${componentName}`;
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let html = fs.readFileSync(`${page}.html`, 'utf8');
  const rootMatch = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>\s*<\/body>/);
  if (rootMatch) {
    html = rootMatch[1];
  } else {
    html = html.replace(/^<div id="root"[^>]*>/, '').replace(/<\/div>$/, '');
  }
  
  fs.writeFileSync(`${dir}/${page}.html`, html);

  const jsx = `import React from 'react';
import htmlContent from './${page}.html?raw';

const ${componentName} = () => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default ${componentName};
`;

  fs.writeFileSync(`${dir}/${componentName}.jsx`, jsx);
  console.log(`Generated ${componentName}.jsx`);
}
