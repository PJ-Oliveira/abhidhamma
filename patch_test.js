const fs = require('fs');
let content = fs.readFileSync('tests/unit/app.test.ts', 'utf8');
content = content.replace("describe('App Integration & User Journeys', () => {", "describe('App Integration & User Journeys', () => {\n  beforeAll(() => {\n    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');\n    document.body.innerHTML = html.match(/<body[^>]*>([\\s\\S]*)<\\/body>/)[1];\n  });");
fs.writeFileSync('tests/unit/app.test.ts', content);
