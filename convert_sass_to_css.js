const fs = require('fs');
const path = require('path');

function convertSassToCss(sassContent) {
  let cssContent = sassContent;
  
  // Convert indentation-based nesting to CSS with braces
  const lines = cssContent.split('\n');
  let result = [];
  let indentStack = [];
  let currentIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      result.push(line);
      continue;
    }
    
    // Skip comments
    if (trimmedLine.startsWith('//')) {
      result.push(line);
      continue;
    }
    
    // Calculate indentation level
    const indent = line.length - line.trimStart().length;
    const indentLevel = Math.floor(indent / 4);
    
    // Close braces for reduced indentation
    while (indentStack.length > indentLevel) {
      result.push('}');
      indentStack.pop();
    }
    
    // Handle selectors and properties
    if (trimmedLine.includes(':')) {
      // This is a property
      if (!trimmedLine.endsWith(';')) {
        result.push(line + ';');
      } else {
        result.push(line);
      }
    } else {
      // This is a selector
      if (trimmedLine.includes('&')) {
        // Handle parent selector
        const parentSelector = indentStack[indentStack.length - 1];
        const newSelector = trimmedLine.replace('&', parentSelector);
        result.push(newSelector + ' {');
        indentStack.push(newSelector);
      } else {
        result.push(line + ' {');
        indentStack.push(trimmedLine);
      }
    }
  }
  
  // Close remaining braces
  while (indentStack.length > 0) {
    result.push('}');
    indentStack.pop();
  }
  
  return result.join('\n');
}

// Convert all CSS files
const stylesDir = path.join(__dirname, 'src', 'styles');
const files = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));

files.forEach(file => {
  const filePath = path.join(stylesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const convertedContent = convertSassToCss(content);
  fs.writeFileSync(filePath, convertedContent);
  console.log(`Converted ${file}`);
}); 