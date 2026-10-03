const fs = require('fs');
const path = require('path');

const chaptersDir = path.join(__dirname, 'src', 'data', 'chapters');
const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.json'));

let fixes = 0;

files.forEach(file => {
  const filePath = path.join(chaptersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let data = JSON.parse(content);
  
  data.forEach(segment => {
    if (segment.translations) {
      if (segment.translations.pt) {
        let text = segment.translations.pt;
        if (text.includes('insight')) {
          text = text.replace(/\binsight\b/g, 'visão profunda');
          fixes++;
        }
        if (text.includes('mindfulness')) {
          text = text.replace(/\bmindfulness\b/g, 'atenção plena');
          fixes++;
        }
        segment.translations.pt = text;
      }
      if (segment.translations.es) {
        let text = segment.translations.es;
        if (text.includes('mindfulness')) {
          text = text.replace(/\bmindfulness\b/g, 'atención plena');
          fixes++;
        }
        if (text.includes('insight')) {
          text = text.replace(/\binsight\b/g, 'visión profunda');
          fixes++;
        }
        segment.translations.es = text;
      }
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log('Fixes applied:', fixes);
