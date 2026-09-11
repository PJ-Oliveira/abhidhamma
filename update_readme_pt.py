import re

with open("README_pt.md", "r") as f:
    content = f.read()

how_to_use = """
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

"""

# Insert before ## 🚀 Funcionalidades
if "## 📖 Como Usar" not in content:
    content = content.replace("## 🚀 Funcionalidades", how_to_use + "## 🚀 Funcionalidades")

with open("README_pt.md", "w") as f:
    f.write(content)
