const https = require('https');
https.get('https://suttacentral.net/api/dictionary_full/bhikkhu?language=en', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.slice(0, 500)));
}).on('error', err => console.log(err.message));
