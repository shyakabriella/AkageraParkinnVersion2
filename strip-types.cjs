const ts = require('typescript');
const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const result = ts.transpileModule(content, {
        compilerOptions: {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.Preserve,
          removeComments: false
        }
      });
      
      fs.writeFileSync(fullPath, result.outputText);
      console.log('Processed', fullPath);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done!');
