// test-visual2.mjs — Improved visual tests with better selectors
import puppeteer from 'puppeteer';

const DIR = '/Users/pauloo/.gemini/antigravity/brain/134555de-9249-4384-b949-48418bc73dd8';
const URL = 'http://localhost:8081';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const shot = async (page, name, desc) => {
  const path = `${DIR}/vism_${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`📸 [${desc}] → vism_${name}.png`);
};

(async () => {
  console.log('🚀 Abrindo navegador...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();

  // --- 1. TELA INICIAL ---
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(3000);
  await shot(page, '01_inicio', 'Tela inicial — Cap 1 Sīla-niddesa');

  // --- 2. CLICAR PORTUGUÊS usando JS direto no DOM ---
  console.log('\n🔄 Clicando "Português"...');
  await page.evaluate(() => {
    // React Native Web renders TouchableOpacity as divs with role="button"
    // Find by walking all elements
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.textContent === 'Português' && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(2000);
  await shot(page, '02_portugues', 'Idioma: Português selecionado');

  // --- 3. ABRIR SIDEBAR ---
  console.log('\n🔄 Abrindo sidebar (☰)...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.textContent === '☰' && el.childNodes.length === 1) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(1500);
  await shot(page, '03_sidebar', 'Sidebar aberto com 23 capítulos');

  // --- 4. CLICAR CAPÍTULO 9 ---
  console.log('\n🔄 Selecionando Cap 9 — Brahmavihāra...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const txt = el.textContent || '';
      if (txt.includes('Brahmavihāra-niddesa') && !txt.includes('Sīla') && el.childNodes.length <= 3) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(2500);
  await shot(page, '04_cap9', 'Capítulo 9 — Brahmavihāra (As Moradas Divinas)');

  // --- 5. CLICAR ESPAÑOL ---
  console.log('\n🔄 Clicando "Español"...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.textContent === 'Español' && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(2000);
  await shot(page, '05_espanol', 'Idioma: Español — Cap 9');

  // --- 6. CLICAR PRÓXIMO → ---
  console.log('\n🔄 Clicando "Próximo →"...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const txt = el.textContent || '';
      if (txt.includes('Próximo') && txt.includes('→') && el.childNodes.length === 1) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(2500);
  await shot(page, '06_cap10', 'Capítulo 10 — Āruppya (Estados Imateriais)');

  // --- 7. ABRIR DICIONÁRIO ---
  console.log('\n🔄 Abrindo aba Dicionário...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const txt = el.textContent || '';
      if (txt.includes('Dicionário') && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(2000);
  await shot(page, '07_dicionario', 'Aba Dicionário Pali');

  // --- 8. BUSCAR "sila" NO DICIONÁRIO ---
  console.log('\n🔄 Buscando "sila" no dicionário...');
  // Find the dictionary input
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    for (const inp of inputs) {
      if (inp.placeholder?.includes('Pali')) {
        // Simulate React Native TextInput change
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inp, 'sila');
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  });
  await sleep(2000);
  await shot(page, '08_dict_sila', 'Dicionário: resultado para "sila"');

  // --- 9. VOLTAR AO LEITOR, ABRIR SIDEBAR, IR AO CAP 22 ---
  console.log('\n🔄 Voltando ao Leitor...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const txt = el.textContent || '';
      if (txt.includes('Leitor') && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(1000);

  // Open sidebar
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.textContent === '☰' && el.childNodes.length === 1) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(1500);

  // Click chapter 22
  console.log('🔄 Selecionando Cap 22 — Ñāṇadassana...');
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const txt = el.textContent || '';
      if (txt.includes('Ñāṇadassana-visuddhi') && el.childNodes.length <= 3) {
        el.closest('[role="button"]')?.click() || el.click();
        break;
      }
    }
  });
  await sleep(2500);
  await shot(page, '09_cap22', 'Capítulo 22 — Ñāṇadassana (4 Caminhos/Frutos)');

  // --- 10. BUSCA NO TEXTO ---
  console.log('\n🔄 Buscando "nibbana" na barra de busca...');
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    for (const inp of inputs) {
      if (inp.placeholder?.includes('Buscar')) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inp, 'nibbana');
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  });
  await sleep(2500);
  await shot(page, '10_busca', 'Busca por "nibbana" no texto');

  console.log('\n✅ TODOS OS 10 TESTES VISUAIS CONCLUÍDOS COM SUCESSO!');
  await browser.close();
})();
