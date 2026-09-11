# Abhidhamma Piṭaka Trilíngue — Registro Mestre do Projeto (Master Log)

**Última atualização:** 2026-08-24  
**Raiz do projeto:** `abhidhamma-pitaka-trilingue-site/`  
**Modelo de implantação:** Site estático — enviado manualmente ao GitHub; sem servidor de build ou CI.  
**Restrição governante:** Nunca executar `git commit` ou `git push`. Todas as alterações são preparadas na pasta local; o usuário envia a pasta diretamente para o GitHub.

---

## Índice do Diretório

| Documento | Escopo |
|---|---|
| [01_architecture.md](01_architecture.md) | Design do sistema, grafo de módulos, fluxo de dados, layout CSS |
| [02_corpus_data.md](02_corpus_data.md) | Catálogo de obras, esquema de segmentos, formato do manifesto, fragmentos JSON |
| [03_frontend_modules.md](03_frontend_modules.md) | Todos os arquivos-fonte TypeScript — propósito, API, estrutura interna |
| [04_build_pipeline.md](04_build_pipeline.md) | Compilação TypeScript → carimbo de versão → índice de busca → dicionários |
| [05_philological_corrections.md](05_philological_corrections.md) | Auditoria de terminologia de Dhamma: ~25.470 correções de segmentos + varredura de dicionário |
| [06_export_module.md](06_export_module.md) | Sistema de exportação PDF / EPUB — arquitetura, pipeline HTML, correções |
| [07_open_issues.md](07_open_issues.md) | Registro de problemas abertos — bugs, déficits, próximos passos |

---

## Visão Geral do Projeto

Uma **aplicação de página única (SPA), totalmente estática e com zero dependências** que apresenta o Abhidhamma Piṭaka completo em paralelo em Pāli / Inglês / Português / Espanhol. Todo o conteúdo é pré-renderizado em fragmentos (shards) JSON; não existe lógica no servidor. O site pode ser implantado no GitHub Pages simplesmente copiando/enviando a pasta.

### Escala do Corpus

| Métrica | Valor |
|---|---|
| Total de obras | 12 (+ 6 comentários contemporâneos em andamento) |
| Total de segmentos (canônicos) | 91.065 |
| Segmentos com marcação HTML inline | 27.462 (30,2%) |
| Tokens de Pāli no corpus | 1.878.244 |
| Idiomas | Pāli · Inglês · Português · Espanhol |

### Catálogo de Obras (contagem de segmentos)

| Obra | Grupo | Segmentos | Partes disponíveis |
|---|---|---|---|
| Dhammasaṅgaṇī | Abhidhamma Piṭaka | 5.930 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Vibhaṅga | Abhidhamma Piṭaka | 7.774 | mūla · aṭṭhakathā · ṭīkā |
| Dhātukathā | Abhidhamma Piṭaka | 999 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Puggalapaññatti | Abhidhamma Piṭaka | 1.044 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Kathāvatthu | Abhidhamma Piṭaka | 5.767 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Yamaka | Abhidhamma Piṭaka | 14.875 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Paṭṭhāna | Abhidhamma Piṭaka | 29.171 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Abhidhammāvatāra | Outros textos | 12.536 | mūla · ṭīkā |
| Abhidhammatthasaṅgaha | Outros textos | 1.672 | mūla |
| Abhidhammamātikā | Outros textos | 2.667 | mūla |
| Visuddhimagga | Visuddhimagga | 7.726 | mūla · ṭīkā · nidānakathā |
| Abhidhamma in Daily Life | Comentários | 904 | texto (EN+PT bilíngue) ✅ |
| Buddhism in Daily Life | Comentários | TBD | texto (EN+PT) ⏳ |
| The Buddha's Path | Comentários | TBD | texto (EN+PT) ⏳ |
| Introduction to the Abhidhamma | Comentários | TBD | texto (EN+PT) ⏳ |
| The Conditionality of Life | Comentários | TBD | texto (EN+PT) ⏳ |
| The Buddhist Teaching on Physical Phenomena | Comentários | TBD | texto (EN+PT) ⏳ |
| Path Without Ownership | Comentários | TBD | texto (EN+PT) ⏳ |
| **Total** | | **91.065 + 6 em integração** | |

### Stack Tecnológica

- **Frontend:** TypeScript 5 → módulos ES2022, sem framework, sem empacotador (bundler)
- **CSS:** Arquivo único `style.css`, propriedades customizadas CSS (variáveis), layout em CSS Grid
- **Dados:** JSON estático, fragmentado (sharded) para carregamento sob demanda (lazy loading)
- **Build:** `tsc` + `scripts/version_js.py` (Python 3)
- **Índice de busca:** Gerado por `scripts/build_search_index.py`
- **Dicionários:** Gerados por `scripts/build_core_dictionary.py` + `scripts/build_common_dictionary.py`

### Scripts de Integração para Comentários Contemporâneos

| Script | Propósito |
|---|---|
| `scripts/integrate_books.py` | Extrai 6 PDFs via ghostscript → fragmentos JSON + patch do manifesto |
| `scripts/translate_books.py` | Traduz EN→PT via API do Gemini (filologicamente correto, retomável) |

**Pipeline de integração:**
```
npm run integrate-books
→ python3 scripts/translate_books.py (requer GEMINI_API_KEY)
→ npm run rebuild-search
→ npm run build
```

### Diretrizes Operativas Absolutas

1. **NUNCA traduzir `dhamma` como `fenômeno`** — dhamma = paramattha-dhamma (realidade última discreta). Isso se aplica a todos os segmentos do corpus, entradas de dicionário, textos da interface e documentação.
2. **NUNCA executar `git commit` ou `git push`** — o usuário envia a pasta para o GitHub manualmente.
3. **`kamma`** é sempre a forma correta em Pāli; "karma" é o cognato em sânscrito e não deve substituí-lo nas traduções.
