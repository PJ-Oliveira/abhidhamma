const fs = require('fs');
const path = require('path');

const chaptersDir = path.join(__dirname, 'src', 'data', 'chapters');
const dictPath = path.join(__dirname, 'src', 'data', 'paliDictionary.json');

const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.json'));
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Criar um Set das palavras que já temos (em minúsculas)
const existingWords = new Set(dict.map(entry => entry.pali.toLowerCase()));

const wordCounts = {};
let totalWords = 0;

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(chaptersDir, file), 'utf8'));
  data.forEach(segment => {
    if (segment.pali) {
      // Limpar pontuação e transformar em minúsculas
      const cleanText = segment.pali.toLowerCase().replace(/[.,;:!?''""\(\)\[\]\-—]/g, ' ');
      const words = cleanText.split(/\s+/).filter(w => w.length > 0);
      
      words.forEach(w => {
        totalWords++;
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      });
    }
  });
});

// Ordenar todas as palavras por frequência
const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);

// Filtrar as que NÃO estão no dicionário
const missingWords = sortedWords.filter(([word, count]) => !existingWords.has(word));

console.log(`Total de palavras no texto (com repetição): ${totalWords}`);
console.log(`Total de palavras únicas: ${sortedWords.length}`);
console.log(`Faltando no dicionário: ${missingWords.length}`);

// Mostrar as 100 mais frequentes que faltam
console.log('\nTop 100 palavras faltando:');
missingWords.slice(0, 100).forEach(([w, c]) => console.log(`${w} (${c})`));
