# Abhidhamma Piṭaka Trilingual Site

> As traduções neste projeto baseiam-se em parte no OpenTipitaka (https://opentipitaka.org), licenciado sob CC BY-NC-SA 4.0. Algumas traduções foram revisadas e corrigidas para este projeto. As traduções revisadas também são distribuídas sob CC BY-NC-SA 4.0.

Uma Aplicação de Página Única (SPA) estática projetada para o estudo profundo e estrutural do Abhidhamma Piṭaka da tradição Theravāda. Oferece uma experiência de leitura trilíngue totalmente alinhada (Pāli, Inglês, Espanhol e Português), além de um conjunto de ferramentas analíticas interativas.


## 📖 Como Usar (How to Use)

O site foi estruturado para suportar o estudo do *Abhidhamma* em diferentes contextos, com foco em resiliência e disponibilidade offline. 

### Modalidades de Acesso
1. **Produção (Online):** Acesse a versão mais recente e oficial em [https://abhidhamma.com.br/](https://abhidhamma.com.br/).
2. **Offline (PWA):** Após o primeiro acesso, você pode instalar o aplicativo em seu celular ou desktop (via botão "Instalar Aplicativo" nas configurações). A estrutura de Progressive Web App (PWA) faz cache integral dos dados de texto e das ferramentas, permitindo leitura profunda e buscas durante viagens ou retiros sem conexão à internet.
3. **Local (Desenvolvimento):** Você pode clonar o repositório e abrir `index.html` via um servidor HTTP local para ter toda a ferramenta rodando na sua máquina.

### Taxonomia do Acervo e Navegação
O corpus foi organizado hierarquicamente de acordo com a tradição *Theravāda*. A barra lateral permite navegar de forma granular por essas camadas interpretativas:

- **Textos Fundamentais (*Mūla*):** Os 7 livros originais do *Abhidhamma Piṭaka* (ex: *Dhammasaṅgaṇī*, *Paṭṭhāna*). Eles formam a raiz ontológica e matricial.
- **Comentários Canônicos (*Aṭṭhakathā*):** Explicações clássicas compiladas por Venerável Buddhaghosa e outros (ex: *Atthasālinī*, *Sammohavinodanī*). Essenciais para compreender o significado preciso de um *dhamma*.
- **Subcomentários (*Ṭīkā / Anuṭīkā*):** Trabalhos escolásticos posteriores (como o *Mūlaṭīkā*) que resolvem ambiguidades filosóficas dos comentários e debatem nuanças epistemológicas.
- **Literatura Contemporânea:** Visões, esquemas estruturais e manuais modernos (ex: *Abhidhammatthasaṅgaha* e textos contemporâneos) para ajudar na visualização e introdução ao sistema.

Ao clicar em um nó na árvore lateral, o texto será carregado na janela principal. Use as abas no topo da página para alternar rapidamente entre o *Mūla*, o *Aṭṭhakathā* correspondente e o *Ṭīkā*, mantendo a rastreabilidade do contexto.

## 🚀 Funcionalidades

- **Leitor Multilíngue**: Leia os textos canônicos do Abhidhamma com alinhamento parágrafo por parágrafo em Pāli, Inglês, Espanhol e Português.
- **Dicionário Pāli Integrado**: Consulta instantânea de termos, alimentada por um dicionário central curado (derivado do Digital Pāli Dictionary) e otimizado para a terminologia do Abhidhamma.
- **Busca Avançada Fragmentada (Sharded)**: Motor de busca de alto desempenho no lado do cliente que utiliza fragmentos (shards) JSON pré-construídos para consultas instantâneas em todo o corpus massivo, sem necessidade de backend.
- **Sistema de Repetição Espaçada (SRS)**: Sistema de flashcards integrado que usa algoritmos de repetição espaçada para memorização de terminologia Pāli complexa e compostos extraídos diretamente dos textos.
- **Ferramentas Analíticas do Abhidhamma**:
  - **Mapa Mental**: Árvore interativa e retrátil visualizando a estrutura hierárquica dos 4 *paramattha dhammas*.
  - **Matriz do Paṭṭhāna**: Matriz interativa de 24 condições que correlaciona os 24 *paccayas* com os grupos analíticos padrão.
  - **Simulador de Citta-Vīthi**: Simulador animado dos processos cognitivos através das 6 portas sensoriais, detalhando a sequência exata de *cittas*.
  - **Explorador de Mātikā**: Interface expansível com busca para estudar os 22 *tikas* (tríades) e 100 *dukas* (díades).
  - **Analisador de Cetasikas**: Componente para inspecionar *cittas* individuais e comparar os *cetasikas* (fatores mentais) comuns e exclusivos entre dois tipos de consciência.

## 🏗️ Arquitetura

O projeto foi construído com extremo foco em desempenho, longevidade e simplicidade. Depende exclusivamente de hospedagem de arquivos estáticos, sem servidores backend ou frameworks pesados de JavaScript.

- **Frontend**: TypeScript puro compilado para JavaScript (Vanilla). Zero dependências npm em tempo de execução.
- **Estilização**: CSS puro utilizando propriedades customizadas (variáveis CSS) para garantir uma consistência temática estrita.
- **Camada de Dados**: Pipeline em Python 3 que processa, limpa e traduz os textos brutos em blocos `.json` otimizados (`data/works/`), compila os dicionários e gera os fragmentos de busca.
- **Gerenciamento de Estado**: Manipulação de DOM no lado do cliente com carregamento preguiçoso (lazy loading) dos módulos para as ferramentas interativas.

## 📝 Fluxo de Trabalho de Revisão Linguística

As traduções em português (e espanhol) passam por uma rigorosa auditoria programática e manual para aderir estritamente à estrutura ontológica canônica Theravāda (conforme definido na *Atthasālinī* e no *Visuddhimagga*).

**Princípios Centrais de Tradução:**
- **Preservação Técnica do Pāli**: Termos-chave como *kamma* (nunca o sanscritizado *karma*), *dhamma* (nunca *dharma*), *nibbāna*, *citta*, *cetasika* e *jhāna* são preservados em sua forma original em Pāli para evitar diluição conceitual.
- **Anti-Psicologização**: Eliminação de sobreposições psicológicas ocidentais (ex.: traduzir *bhavaṅga* como "subconsciente" ou "inconsciente").
- **Precisão Ontológica**: O termo *dhamma* é rigorosamente traduzido como "realidade" em contextos ontológicos, rejeitando correspondências kantianas como "fenômeno".

*Consulte o documento interno `docs/abhidhamma_knowledge_base.md` do projeto para acessar as diretrizes terminológicas e doutrinárias completas.*

## ⚙️ Instruções de Build e Execução

Para rodar o projeto localmente ou prepará-lo para deploy no GitHub Pages:

### Pré-requisitos
- Node.js (para o compilador TypeScript)
- Python 3.x (para scripts de processamento de dados)

### Configuração e Compilação
1. **Instalar Dependências de Desenvolvimento:**
   ```bash
   npm install
   ```
2. **Construir Índice de Busca:** (Execute isso sempre que os dados de tradução forem alterados)
   ```bash
   python3 scripts/build_search_index.py
   ```
3. **Compilar TypeScript e Versionar Arquivos:**
   ```bash
   npm run build
   ```
   *Este comando compila todos os arquivos `.ts` para a pasta `js/` e roda automaticamente o script `scripts/version_js.py` para anexar hashes de quebra de cache (`?v=hash`) aos seus imports.*

### Servidor de Desenvolvimento Local
Sirva o diretório raiz usando o servidor HTTP embutido do Python:
```bash
python3 -m http.server 8000
```
Em seguida, acesse `http://localhost:8000` no seu navegador.

## 🌐 Deploy
O projeto é estruturalmente otimizado para o **GitHub Pages**. Basta fazer push da branch `main` para o GitHub e configurar o GitHub Pages para servir a partir do diretório raiz `/`. Nenhuma pipeline complexa de CI/CD ou servidor backend é necessária.

## 🤝 Feedback e Agradecimentos

Por gentileza, se notar algum erro, erro de digitação (typo) ou algo análogo, por favor, entre em contato comigo para que eu possa corrigir. Ainda faltam realizar algumas atualizações na versão em espanhol, o que espero fazer em breve. Além disso, espero estar sempre revisando o projeto e recebendo feedbacks para poder tornar essa ferramenta cada vez melhor, mais acessível e conceitualmente mais rigorosa.

Agradeço profundamente aos meus professores e ao Open Tipitaka.
