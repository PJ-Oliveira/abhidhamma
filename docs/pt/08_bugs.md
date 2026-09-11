# Bugs e Problemas Conhecidos

Bugs identificados por análise estática do código-fonte. Nenhum foi confirmado por execução em runtime.

---

## BUG-001 — Service Worker: Cache Miss no App Shell (ALTA)

**Arquivo:** `service-worker.js`

**Problema:** `CORE_ASSETS` lista `./js/app.js` sem o sufixo `?v={hash}`. O arquivo real servido por `index.html` é `./js/app.js?v=c1e87eca`. O Service Worker não encontrará o app JS no cache, causando fallback de rede e falha de inicialização offline.

**Impacto:** O app não inicializa offline. Os usuários que abrem o app sem rede recebem erro.

**Correção:** Certificar que `CORE_ASSETS` inclui a URL versionada, ou usar a API `Cache.add()` que segue redirecionamentos, ou manter um arquivo de manifesto de versão separado para que o service worker possa construir a URL correta.

---

## BUG-002 — SRS: Atalhos de Teclado Não Funcionam

**Arquivo:** `src/srs.ts`

**Problema:** O listener de teclado está anexado a `container` (o div do painel), mas usa `container.closest(".panel")` para verificação de foco. Esse método retorna null porque `.panel` é um ancestral, não descendente. O resultado é que os atalhos (Space/Enter/1-4) nunca disparam.

**Impacto:** Os usuários devem clicar nos botões de avaliação manualmente; nenhuma funcionalidade de teclado funciona no painel SRS.

**Correção:** Mude o listener para `document.addEventListener("keydown", ...)` com uma verificação de que o painel SRS está ativo, ou corrija a lógica `closest` para checar se o painel SRS está ativo via `AppState`.

---

## BUG-003 — SRS: Arquivo de Vocabulário Faltando

**Arquivo:** `src/srs.ts` (linha de carregamento de dados)

**Problema:** `srs.ts` tenta buscar `data/srs/vocabulary.json`. Esse arquivo não existe no repositório.

**Impacto:** O painel SRS falha silenciosamente no carregamento (erro de rede), mostrando sem cartões.

**Correção:** Criar `data/srs/vocabulary.json` com dados de vocabulário Pāli, ou mudar o SRS para gerar cartões dinamicamente a partir do corpus do dicionário.

---

## BUG-004 — app.ts: Branch Morta em `parseHash()`

**Arquivo:** `src/app.ts`

**Problema:** `parseHash()` tem um branch `if (parts[0] === "tipitaka")` que verifica o primeiro segmento do hash. Porém, o `window.location.hash` sempre começa com `#`, e a análise divide por `/` após remover `#` — portanto `parts[0]` é sempre uma string vazia `""` para URLs como `#/tipitaka/...`. O branch nunca é alcançado.

**Impacto:** Código morto. Navegação de `#/tipitaka/...` pode não funcionar corretamente se esse branch era destinado a tratamento especial.

**Correção:** Depurar a análise de hash e remover ou corrigir o branch morto. Verificar que `parts[1]` é usado para o panel ID (índice após a barra inicial).

---

## BUG-005 — export.ts: Condição do Título Sempre Falsa

**Arquivo:** `src/export.ts`

**Problema:** A condição para incluir o título da obra no HTML de impressão verifica `if (workEntry.title && workEntry.title !== undefined)`. A segunda condição é redundante e sempre verdadeira quando a primeira é verdadeira. Provavelmente pretendia verificar algo diferente (ex: se `workEntry.title !== workEntry.id`).

**Impacto:** Baixo — o título é sempre incluído onde deveria ser. O código pode estar encobrindo um bug lógico anterior.

**Correção:** Revisar a condição pretendida; remover a verificação redundante.

---

## BUG-006 — selection.ts: Promise de Clipboard sem `.catch()`

**Arquivo:** `src/selection.ts`

**Problema:** `navigator.clipboard.writeText(text)` retorna uma Promise que não tem handler `.catch()`. Se copiar falha (ex: usuário nega permissão de clipboard, contexto não-seguro), a Promise rejeita e torna-se uma rejeição de Promise não tratada.

**Impacto:** Erro silencioso no console; nenhum feedback ao usuário de que copiar falhou.

**Correção:** Adicionar `.catch(err => console.warn("Copy failed", err))` ou atualizar a UI para indicar falha.

---

## BUG-007 — reader.ts: XSS via `innerHTML` em Conteúdo Pāli

**Arquivo:** `src/reader.ts`

**Problema:** `paliText.innerHTML = seg.pali` define innerHTML diretamente de dados JSON. Enquanto os dados do corpus são confiáveis e controlados, qualquer corrupção de dados ou ataque de supply chain pode injetar HTML/JS arbitrário. A mesma coisa acontece com campos de tradução (`translationEl.innerHTML = seg.en`).

**Impacto:** Risco de segurança teórico (baixo para um app puramente offline/local). Se os dados do corpus forem comprometidos, XSS é possível.

**Correção:** Para o campo Pāli (que requer tags inline como `<b>` e `<sup>`): sanitizar com DOMPurify ou uma allowlist HTML estrita. Para campos de tradução, se não houver HTML pretendido, usar `textContent` em vez de `innerHTML`.

---

## BUG-008 — i18n.ts: Fallback Documentado Incorretamente

**Arquivo:** `src/i18n.ts` (vs. `docs/01_architecture_en.md`)

**Problema:** A documentação de arquitetura antiga afirma que a cadeia de fallback é `STRINGS[uiLang][key]` → `STRINGS.pt[key]`. O código real faz fallback para `STRINGS.en[key]`. A documentação está errada, não o código.

**Impacto:** Problema de documentação. Usuários de PT podem ver strings em EN para chaves faltando em vez de PT.

**Correção:** Atualizar a documentação (feito neste conjunto de docs). Considerar se o fallback para EN é a escolha certa ou se deveria haver um fallback para PT para falantes de português.

---

## BUG-009 — tools.ts: `history.replaceState` Quebra Roteamento Hash

**Arquivo:** `src/tools/tools.ts`

**Problema:** `switchTab()` usa `history.replaceState(null, "", "#/tools/{tabId}")` para sincronizar a URL com a aba de ferramenta ativa. Porém, quando o usuário navega para longe das ferramentas e volta usando os botões Voltar/Avançar do navegador, o event listener `hashchange` do roteador principal pode não re-inicializar o painel de ferramentas corretamente porque `replaceState` não dispara `hashchange`.

**Impacto:** Botão Voltar do navegador pode levar a estado inconsistente no painel de ferramentas.

**Correção:** Usar `location.hash = "#/tools/{tabId}"` em vez de `replaceState`, ou sincronizar a inicialização de ferramentas com o evento `popstate`.

---

## BUG-010 — export.ts: `collectUsedTerms()` com Correspondência Imprecisa

**Arquivo:** `src/export.ts`

**Problema:** `collectUsedTerms()` coleta entradas do dicionário usadas no texto do corpus para o apêndice de glossário do EPUB. Faz correspondência de substring para verificar se um termo do dicionário aparece nos segmentos Pāli. Correspondência de substring pode produzir falsos positivos (ex: o termo "ti" correspondendo a qualquer palavra contendo "ti") e falsos negativos para formas inflectidas.

**Impacto:** O glossário do EPUB pode incluir termos irrelevantes ou omitir termos usados.

**Correção:** Usar correspondência baseada em token com normalização morfológica (já disponível em `normalizePali` de `dictionary.ts`).

---

## BUG-011 — index.html: Texto Hardcoded em Português

**Arquivo:** `index.html`

**Problema:** O cabeçalho `<h2>` do painel de configurações é hardcoded como "Configurações" em vez de usar o sistema `t()`. Se a UI estiver definida para EN ou ES, esse cabeçalho permanece em PT.

**Impacto:** Cosmético/NEGLIGÍVEL. Apenas um elemento de UI não é traduzido.

**Correção:** Mover o rótulo para `STRINGS` em `i18n.ts` e renderizá-lo dinamicamente com `t("settings", uiLang)`.

---

## Resumo de Bugs por Severidade

| Severidade | IDs dos Bugs |
|---|---|
| ALTA | BUG-001, BUG-003 |
| MÉDIA | BUG-002, BUG-007, BUG-009 |
| BAIXA | BUG-004, BUG-005, BUG-006, BUG-010 |
| NEGLIGÍVEL | BUG-008, BUG-011 |
