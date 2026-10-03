// test-visual.mjs — Visual testing script for Visuddhimagga Reader
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const SCREENSHOTS_DIR = '/Users/pauloo/.gemini/antigravity/brain/134555de-9249-4384-b949-48418bc73dd8';
const URL = 'http://localhost:8081';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function screenshot(page, name, step) {
  const path = `${SCREENSHOTS_DIR}/test_${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`📸 [${step}] Screenshot: ${name}`);
  return path;
}

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();
  
  // 1. HOME — Chapter 1
  console.log('\n=== TEST 1: Home Screen — Capítulo 1 ===');
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);
  await screenshot(page, '01_home_chapter1', 'Tela inicial com Capítulo 1');

  // 2. Click SIDEBAR (☰ button)
  console.log('\n=== TEST 2: Abrir Sidebar ===');
  const menuBtn = await page.$('[style*="backgroundColor"][style*="4B2E2A"]');
  if (menuBtn) {
    await menuBtn.click();
  } else {
    // Try finding by text content ☰
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('[role="button"]');
      for (const b of buttons) {
        if (b.textContent?.includes('☰')) { b.click(); break; }
      }
    });
  }
  await sleep(1000);
  await screenshot(page, '02_sidebar_open', 'Sidebar aberta com capítulos');

  // 3. Click on Chapter 9 (Brahmavihāra)
  console.log('\n=== TEST 3: Navegar para Capítulo 9 ===');
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[role="button"]');
    for (const el of elements) {
      if (el.textContent?.includes('Brahmavihāra')) { el.click(); break; }
    }
  });
  await sleep(2000);
  await screenshot(page, '03_chapter9', 'Capítulo 9 — Brahmavihāra');

  // 4. Click "Português" language selector
  console.log('\n=== TEST 4: Trocar idioma para Português ===');
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role="button"]');
    for (const b of buttons) {
      if (b.textContent?.trim() === 'Português') { b.click(); break; }
    }
  });
  await sleep(1500);
  await screenshot(page, '04_portugues', 'Idioma trocado para Português');

  // 5. Click "Español"
  console.log('\n=== TEST 5: Trocar idioma para Español ===');
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role="button"]');
    for (const b of buttons) {
      if (b.textContent?.trim() === 'Español') { b.click(); break; }
    }
  });
  await sleep(1500);
  await screenshot(page, '05_espanol', 'Idioma trocado para Español');

  // 6. Click "Próximo →" to go to Chapter 10
  console.log('\n=== TEST 6: Avançar capítulo (Próximo →) ===');
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role="button"]');
    for (const b of buttons) {
      if (b.textContent?.includes('Próximo')) { b.click(); break; }
    }
  });
  await sleep(2000);
  await screenshot(page, '06_chapter10_next', 'Capítulo 10 via botão Próximo');

  // 7. Click "📚 Dicionário" tab
  console.log('\n=== TEST 7: Abrir Dicionário ===');
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role="button"]');
    for (const b of buttons) {
      if (b.textContent?.includes('Dicionário')) { b.click(); break; }
    }
  });
  await sleep(1500);
  await screenshot(page, '07_dictionary', 'Aba do Dicionário Pali');

  // 8. Type "samadhi" in dictionary search
  console.log('\n=== TEST 8: Buscar "samadhi" no dicionário ===');
  const dictInput = await page.$('input[placeholder*="Pali"]');
  if (dictInput) {
    await dictInput.type('samadhi', { delay: 80 });
    await sleep(1500);
  }
  await screenshot(page, '08_dict_samadhi', 'Resultado do dicionário: samadhi');

  // 9. Go back to Reader tab, open sidebar, go to last chapter
  console.log('\n=== TEST 9: Navegar para último capítulo (23) ===');
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role="button"]');
    for (const b of buttons) {
      if (b.textContent?.includes('Leitor')) { b.click(); break; }
    }
  });
  await sleep(500);
  // Open sidebar
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role="button"]');
    for (const b of buttons) {
      if (b.textContent?.includes('☰')) { b.click(); break; }
    }
  });
  await sleep(1000);
  // Click chapter 23
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[role="button"]');
    for (const el of elements) {
      if (el.textContent?.includes('23') && el.textContent?.includes('samāpatti')) { el.click(); break; }
    }
  });
  await sleep(2000);
  await screenshot(page, '09_chapter23_final', 'Capítulo 23 — Último capítulo');

  // 10. Search bar test
  console.log('\n=== TEST 10: Testar busca por "nibbāna" ===');
  const searchInput = await page.$('input[placeholder*="Buscar"]');
  if (searchInput) {
    await searchInput.type('nibbana', { delay: 80 });
    await sleep(2000);
  }
  await screenshot(page, '10_search_nibbana', 'Busca por nibbāna');

  console.log('\n✅ Todos os 10 testes visuais concluídos!');
  await browser.close();
})();
