# Abhidhamma Piṭaka Trilíngue — Visão Geral do Projeto

## O que é este projeto?

O **Abhidhamma Piṭaka Trilíngue** é um Progressive Web App (PWA) executado inteiramente no navegador, para leitura, estudo e exportação do Cânone Pāli Abhidhamma Piṭaka — uma das três divisões principais (_piṭaka_) do Cânone Budista Theravāda — em três idiomas: **Pāli** (original), **Inglês** e **Português**, com Espanhol também presente nos dados.

Não há backend no servidor. Todo o conteúdo, lógica e estado rodam completamente no navegador.

---

## Escopo e Conteúdo

O corpus abrange **sete obras canônicas do Abhidhamma** mais textos complementares:

| Chave do grupo | Obras incluídas |
|---|---|
| `abhidhamma` | Dhammasaṅgaṇī, Vibhaṅga, Dhātukathā, Puggalapaññatti, Kathāvatthu, Yamaka, Paṭṭhāna |
| `outros` | Abhidhammatthasaṅgaha, Abhidhammāvatāra, outros manuais |
| `visuddhimagga` | Visuddhimagga (Caminho da Purificação) |
| `comentarios` | Comentários contemporâneos (bilíngue EN-PT) |

Cada obra é dividida em **partes** (mūla, aṭṭhakathā, ṭīkā, anuṭīkā…) e subdividida em **arquivos JSON de fragmentos** de ~900 segmentos para carregamento eficiente.

---

## Funcionalidades Principais

| Funcionalidade | Descrição |
|---|---|
| **Leitor trilíngue** | Pāli alinhado com traduções EN/PT/ES, segmento por segmento |
| **Árvore de navegação** | Árvore hierárquica expansível de todas as obras e partes |
| **Dicionário Pāli** | 721 lemas de alta frequência + 182 entradas gerais; normalização morfológica |
| **Busca completa** | Índice invertido fragmentado; busca em Pāli, EN, PT, ES |
| **Favoritos e Histórico** | Persistentes via localStorage |
| **Exportação** | PDF (impressão do navegador) e EPUB 3 com apêndice de glossário |
| **SRS** | Sistema de Repetição Espaçada (SM-2) para memorização de vocabulário Pāli |
| **Ferramentas Abhidhamma** | Visualizações interativas: Mapa Mental, relações Paṭṭhāna, Citta-Vīthi, Mātikās, Cetasika |
| **Simulador de Debate** | Motor lógico de debate canônico baseado na Kathāvatthu |
| **PWA / Offline** | Service Worker pré-armazena todos os ~140 MB de conteúdo para leitura offline |
| **i18n** | Interface em PT, EN ou ES; idioma de tradução selecionável independentemente |

---

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript 5.6 (compilado para módulos ES2022 via `tsc`) |
| Execução | Navegador (sem Node.js em runtime) |
| Framework de testes | Vitest 4 com jsdom e cobertura via V8 |
| Build | `tsc` + `scripts/version_js.py` (hash de cache-busting) |
| Deploy | Arquivos estáticos (GitHub Pages via `.nojekyll`) |
| Fonte tipográfica | Gentium Book Plus (TTF incluído) |
| Dependência de IA | `@mlc-ai/web-llm` (carregado de forma lazy — não usado no build estável atual) |

---

## Início Rápido

```bash
# Instalar dependências de desenvolvimento
npm install

# Rodar testes
npm test

# Build (compilação TypeScript + carimbo de versão)
npm run build

# Modo watch
npm run watch
```

Abra `index.html` no navegador (ou sirva com qualquer servidor de arquivos estáticos). Nenhum passo de build é necessário para visualizar; os arquivos `js/` compilados estão versionados.

---

## Hierarquia de Arquivos (nível raiz)

```
index.html           Ponto de entrada
css/style.css        Folha de estilos única
js/                  Módulos JS compilados (versionados)
src/                 Código-fonte TypeScript
data/
  manifest.json      Registro de obras/partes/fragmentos
  works/{id}/*.json  Fragmentos de conteúdo
  dictionary/        Dicionários Pāli
  search/            Fragmentos de busca
fonts/               Gentium Book Plus TTF
img/                 Logo
service-worker.js    Cache PWA
manifest.json        Web App Manifest
tests/               Testes unitários (Vitest)
scripts/             Auxiliares de build (Python)
docs/                Documentação (esta pasta)
```
