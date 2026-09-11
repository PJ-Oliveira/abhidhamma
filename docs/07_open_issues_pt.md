# 07 — Registro de Problemas Abertos

**Formato:** ID · Gravidade · Componente · Descrição · Impacto · Próxima ação

Gravidade: **CRITICAL** (integridade dos dados ou falha completa de funcionalidade) · **HIGH** (bug visível ao usuário, significativo) · **MEDIUM** (experiência degradada) · **LOW** (menor/cosmético)

---

## Problemas Ativos

---

### OI-003 · MEDIUM · Exportação · PDF via iframes em modo sandbox sempre aciona download de arquivo

**Natureza:** O iframes em modo sandbox bloqueia todos os pop-ups incondicionalmente. `openPrintWindow()` detecta o pop-up bloqueado e recorre ao download do arquivo HTML como alternativa. O usuário deve abrir o arquivo manualmente e pressionar Cmd+P / Ctrl+P.

**Impacto:** A exportação de PDF funciona corretamente em um navegador real (Chrome, Firefox, Safari). No iframes em modo sandbox, requer um passo adicional.

**Causa raiz:** Política de sandbox do painel do navegador; não pode ser corrigida no código da aplicação.

**Solução alternativa:** Testar a exportação de PDF em uma aba de navegador real aberta diretamente em `localhost:PORT`.

**Próxima ação:** Nenhuma ação necessária; documentar esta limitação para os usuários.

---

### OI-006 · MEDIUM · Dicionário · Estágio 7 em andamento — 69,0% de cobertura vs meta de 82%

**Natureza:** `pali_core.json` atualmente cobre 69,0% das ocorrências de tokens do corpus (797 entradas). A meta de compilação é de 82%. Os ~13% restantes requerem entradas adicionais em `build_core_dictionary.py`.

**Progresso do estágio 7 (lotes 3–5):**
- **RESOLVIDO:** Desambiguação `katatta`/`kaṭattā` — a forma dental possui apenas 2 ocorrências vs 395 para a retroflexa; confirmado como variante ortográfica, não um lema separado
- **78 novas entradas adicionadas** nos lotes 3–5:
  - 10 termos compostos de condições do Paṭṭhāna (atthipaccaya, kammapaccaya, adhipatipaccaya, etc.)
  - 16 fórmulas de negação do Paṭṭhāna (nahetu, nahetuṃ, nahetuyā, nakamme, navippayutte, etc.)
  - 13 palavras gramaticais/numerais de alta frequência (tīṇi, tato, ceva, tayo, tasmā, cattāri, cattāro, etc.)
  - 3 compostos técnicos do Abhidhamma (kaṭattārūpa, pahātabbahetuka, uppādakkhaṇa)
  - 9 termos de rūpa (sukhindriya, dukkhindriya, āpo, tejo, vāyo, kalāpa, hadaya, etc.)
  - 7 fatores do Nobre Caminho Óctuplo (sammāsaṅkappa até sammāsamādhi)
  - 10 numerais locativos, pronomes reflexivos e formas flexionadas (tīsu, dvīsu, catūsu, attano, etc.)
  - 10 termos de discurso/comentário (āvuso, bhante, sādhu, yebhuyyena, etc.)

**Lacuna restante:** ~244.303 ocorrências de tokens (13,0%). Alcançar 82% requer ~600+ entradas adicionais com extração sistemática da tabela `lookup` do DPD — um esforço que requer múltiplas sessões.

**Impacto:** Aproximadamente 582.303 ocorrências de tokens do corpus ainda não possuem entrada no dicionário.

**Próxima ação:** Continuar adicionando entradas em sessões subsequentes. Categorias prioritárias: fórmulas de negação do Paṭṭhāna restantes, flexões verbais de alta frequência e mais compostos técnicos.

---

## Problemas Resolvidos (Arquivo)

| ID | Data de resolução | Problema | Resolução |
|---|---|---|---|
| OI-001 | 2026-08-23 | "psíquico" — 323 instâncias não auditadas | Auditado: todas as 323 traduzem `iddhi` (poderes supranormais); "poderes psíquicos" é terminologia budista padrão em PT. Nenhuma alteração necessária. |
| OI-002 | 2026-08-23 | "estado" como tradução de dhamma — auditoria parcial | Auditado: 3 instâncias restantes traduzem `dhammabhāva`/`dhammamattattā` (natureza de dhamma/condição de dhamma) — metalinguístico, não traduzindo dhamma em si. Aceitável. |
| OI-004 | 2026-08-23 | Nenhuma opção de exportação apenas em PT | Adicionados `"pt"` e `"pali+pt"` ao tipo `LangMode`, `langOptions` e `segToHtml`; adicionadas as chaves i18n `exportLangPt`/`exportLangPaliPt` para todos os 3 idiomas da interface. |
| OI-005 | 2026-08-23 | `rend="book"/"title"/"nikaya"` não mapeados em `segToHtml` | Adicionados mapeamentos h1/h4/p para `book`, `title`, `nikaya`, `subsubhead`, `centre`, `glossary` em `segToHtml()`; adicionadas regras CSS a `PRINT_CSS` e `EPUB_CSS`. |
| OI-007 | 2026-08-23 | Busca limitada a 30 entradas por token | Elevado `MAX_POSTINGS_PER_TOKEN` de 30 para 50 em `build_search_index.py`; índice de busca reconstruído. |
| OI-008 | 2026-08-23 | Tag anômala `<x_bin_42>` | Localizada em `vibhanga/tika__0.json` seg 687 (campo `en`). Restaurado `yogo<x_bin_42>o` corrompido para `yogova` (correspondendo à oração paralela `payogova`). |
| OI-009 | 2026-08-23 | Rótulos do painel de exportação desatualizados após alteração do idioma da interface | Removida a captura de `const uiLang`; todas as chamadas agora leem `settings.uiLang` dinamicamente. Adicionada a reinicialização do painel em `refreshLocalizedUI()` em `app.ts`. |
| OI-010 | 2026-08-23 | Código morto de `dpd.json` em `dictionary.ts` | Removido o bloco `try/catch` morto (linhas 42–47); sem impacto funcional. |
| OI-011 | 2026-08-23 | Verificação de intervalo de attha do Paṭṭhāna | Banco de dados fonte auditado: `abh03a_att` tem ID máx 2421 (2422 linhas no total); a extração já utiliza todas as linhas 1766–2421. O comentário é curto no nível da fonte — não existem dados adicionais. |
| — | 2026-08 | URL `about:` bloqueada no painel do navegador durante exportação de PDF | Alterada para `URL.createObjectURL(blob)` para a URL do pop-up |
| — | 2026-08 | Chrome não carregando `export.js` atualizado (cache de módulos ES) | Criado `scripts/version_js.py` para carimbar `?v={hash}` pós-compilação |
| — | 2026-08 | Tags HTML brutas visíveis como texto literal na saída PDF/EPUB | Adicionados `fieldHtml()`/`walkNode()` usando `DOMParser` |
| — | 2026-08 | 22 ocorrências de "fenômeno" em `pali_core.json` | Corrigidas todas as 22; mantida 1 ocorrência intencional de instrução negativa |
| — | 2026-08 | 5 ocorrências de "fenômeno" em `common_pali.json` | Corrigidas todas as 5 |
| — | 2026-08 | ~25.470 ocorrências de "fenômeno" no nível de segmento nas traduções em PT | Corrigidas em massa em todas as 12 obras |
| — | 2026-08 | Segmento corrompido `yamaka/mula__9.json` seg 174 (`fenômenosamp;`) | Corrigido para o texto correto em PT |
| — | 2026-08 | Índice de busca desatualizado após correções no corpus | Reconstruído do zero via `build_search_index.py` |

### OI-004 · RESOLVED (HIGH) · Conteúdo/Filologia · Violações residuais da filosofia do Abhidhamma no Dicionário
**Natureza:** As definições no dicionário `pali_core.json` ainda contêm termos não-canónicos como "fenômenos condicionados" (na definição de *anattā*) e "karma" (na definição de *cetanā*, ex: "o cetasika gerador de karma"), violando as diretrizes ontológicas rigorosas. Várias definições em espanhol também contêm "fenómeno".
**Impacto:** Desalinhamento das definições do dicionário em relação à filosofia estrita do Abhidhamma (onde *dhamma* = realidade, *kamma* = kamma).
**Próxima ação:** Realizar uma substituição direcionada dentro de `data/dictionary/*.json`.

### OI-005 · RESOLVED (MEDIUM) · Conteúdo/Filologia · Falhas na regex para "subconsciência" e no corpus em Inglês
**Natureza:** O script usado para limpar o corpus `data/works/` utilizou uma regex estrita (`\bsubconsciente\b`) e deixou escapar formas derivadas como `subconsciência` (PT), `subconsciencia` (ES) e `subconscientes`. Além disso, as traduções em inglês ainda usam pesadamente "karma", "dharma" e "subconsciousness".
**Impacto:** Termos psicológicos e sanscritizados residuais permanecem em locais isolados (ex: *Abhidhamma in Daily Life*, *Abhidhammāvatāra ṭīkā*).
**Próxima ação:** Escrever um script de regex mais abrangente para auditar `data/works/` focando em todas as variações morfológicas de `subconsci*`, e estender a auditoria filosófica para as strings em inglês (`en`) para "kamma" e "dhamma".

### OI-006 · RESOLVED (LOW) · UI/UX · Responsividade em dispositivos móveis para as ferramentas analíticas
**Natureza:** A matriz do `patthana` e a árvore do `mindmap` podem gerar elementos DOM muito largos. Embora `overflow-x: auto` esteja parcialmente implementado, layouts de grade complexos em ecrãs móveis pequenos podem cortar os rótulos ou carecer de cabeçalhos fixos (sticky), dificultando a correlação.
**Impacto:** Experiência do usuário degradada em dispositivos móveis ao utilizar as ferramentas analíticas avançadas.
**Próxima ação:** Testar a interface em resoluções de telemóvel e implementar `position: sticky` para a primeira coluna/linha na matriz do Paṭṭhāna.
