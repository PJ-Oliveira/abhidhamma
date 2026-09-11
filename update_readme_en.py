import re

with open("README.md", "r") as f:
    content = f.read()

how_to_use = """
## 📖 How to Use

The platform is designed to support the study of the *Abhidhamma* in diverse contexts, with a strong emphasis on resilience and offline availability.

### Access Modes
1. **Production (Online):** Access the latest official release at [https://abhidhamma.com.br/](https://abhidhamma.com.br/).
2. **Offline (PWA):** After your initial visit, you can install the application on your mobile device or desktop (via the "Install App" button in settings). The Progressive Web App (PWA) architecture fully caches text data and analytical tools, enabling deep reading and complex searches during travel or meditation retreats without an internet connection.
3. **Local (Development):** You can clone the repository and serve `index.html` via a local HTTP server to run the entire tool suite natively on your machine.

### Corpus Taxonomy and Navigation
The corpus is hierarchically organized according to the orthodox *Theravāda* tradition. The sidebar tree allows granular navigation across these interpretive layers:

- **Fundamental Texts (*Mūla*):** The 7 original books of the *Abhidhamma Piṭaka* (e.g., *Dhammasaṅgaṇī*, *Paṭṭhāna*). These form the core ontological and structural matrix.
- **Canonical Commentaries (*Aṭṭhakathā*):** Classical explanations compiled by Venerable Buddhaghosa and others (e.g., *Atthasālinī*, *Sammohavinodanī*). They are essential for grasping the precise technical definition of each *dhamma*.
- **Subcommentaries (*Ṭīkā / Anuṭīkā*):** Later scholastic works (like the *Mūlaṭīkā*) that resolve philosophical ambiguities within the commentaries and debate epistemological nuances.
- **Contemporary Literature:** Modern schemas, manuals (e.g., *Abhidhammatthasaṅgaha*), and contemporary texts that assist in visualization and act as an introduction to the system.

Upon clicking a node in the sidebar tree, the text is loaded into the main viewing area. Use the tabs at the top of the page to seamlessly switch between the *Mūla*, the corresponding *Aṭṭhakathā*, and the *Ṭīkā*, maintaining full contextual traceability.

"""

if "## 📖 How to Use" not in content:
    content = content.replace("## 🚀 Features", how_to_use + "## 🚀 Features")

with open("README.md", "w") as f:
    f.write(content)
