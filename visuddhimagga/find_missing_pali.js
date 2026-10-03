const fs = require('fs');

const visuddhimaggaPath = "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/visuddhimagga/mula__0.json";
const dictPath = "/Users/pauloo/Desktop/abhidhamma/visuddhimagga/src/data/paliDictionary.json";

const data = JSON.parse(fs.readFileSync(visuddhimaggaPath, 'utf8'));
const dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Build dictionary word set (lowercase, normalized)
const dictWords = new Set();
dictionary.forEach(entry => {
    dictWords.add(entry.pali.toLowerCase());
});

// Count word frequencies
const wordFreq = {};
data.forEach(segment => {
    if (segment.pali) {
        // Strip punctuation and split
        const words = segment.pali.toLowerCase().replace(/[,.;:!?''"“”()[\]-]/g, ' ').split(/\s+/);
        words.forEach(w => {
            if (w.length > 2) {
                wordFreq[w] = (wordFreq[w] || 0) + 1;
            }
        });
    }
});

// Find missing words
const missingWords = [];
for (const [word, freq] of Object.entries(wordFreq)) {
    if (!dictWords.has(word)) {
        missingWords.push({ word, freq });
    }
}

// Sort by frequency descending
missingWords.sort((a, b) => b.freq - a.freq);

console.log(`Found ${missingWords.length} missing words. Top 20:`);
console.log(missingWords.slice(0, 150));

