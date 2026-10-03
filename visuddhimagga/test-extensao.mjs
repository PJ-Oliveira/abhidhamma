import puppeteer from 'puppeteer';

(async () => {
  console.log('Abrindo navegador...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Resolução comum de um Popup de Extensão de Navegador
  await page.setViewport({ width: 450, height: 600 });
  
  console.log('Carregando a aplicação estática (dist)...');
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
  
  // Aguarda as fontes carregarem e o render estabilizar
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Capturando tela inicial...');
  await page.screenshot({ path: '/Users/pauloo/.gemini/antigravity/brain/134555de-9249-4384-b949-48418bc73dd8/extensao_preview.png' });
  
  // Clica no botão de Menu (☰) usando avaliação de texto, similar aos scripts anteriores
  const menuClicked = await page.evaluate(() => {
    const texts = Array.from(document.querySelectorAll('div'));
    const menuBtn = texts.find(el => el.textContent === '☰' && window.getComputedStyle(el).cursor === 'pointer');
    if (menuBtn) {
      menuBtn.click();
      return true;
    }
    return false;
  });

  if (menuClicked) {
    await new Promise(r => setTimeout(r, 600)); // Tempo da animação do sidebar
    console.log('Capturando sidebar aberto...');
    await page.screenshot({ path: '/Users/pauloo/.gemini/antigravity/brain/134555de-9249-4384-b949-48418bc73dd8/extensao_sidebar.png' });
  }

  await browser.close();
  console.log('Pronto!');
})();
