#!/usr/bin/env python3
"""
translate_books.py — Traduz segmentos EN→PT para livros contemporâneos.

A chave Gemini é lida do arquivo .env na raiz do projeto:
  GEMINI_API_KEY=AIza...

Uso:
  python3 scripts/translate_books.py buddhism-in-daily-life
  python3 scripts/translate_books.py the-buddhas-path
  ...

Processa UM livro por vez. Para o próximo, rode novamente com o id do próximo livro.
"""

import json, os, sys, time, re
import google.generativeai as genai

BASE     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DAT_DIR  = os.path.join(BASE, "data", "works")
ENV_FILE = os.path.join(BASE, ".env")

# ──────────────────────────────────────────────
# Ordem dos livros (referência para o usuário)
# ──────────────────────────────────────────────
BOOK_ORDER = [
    ("buddhism-in-daily-life",                    "Buddhism in Daily Life"),
    ("the-buddhas-path",                           "The Buddha's Path"),
    ("introduction-to-the-abhidhamma",             "Introduction to the Abhidhamma"),
    # abhidhamma-in-daily-life já está traduzido — modelo de referência
    ("the-conditionality-of-life",                 "The Conditionality of Life"),
    ("the-buddhist-teaching-on-physical-phenomena","The Buddhist Teaching on Physical Phenomena"),
    ("path-without-ownership",                     "Path Without Ownership"),
]

# ──────────────────────────────────────────────
# System prompt com exemplos reais do modelo
# ──────────────────────────────────────────────
SYSTEM_PROMPT = """Você é um tradutor especializado em textos budistas Theravāda, especialmente da tradição Abhidhamma.
Seu trabalho é traduzir textos de Nina van Gorkom e Rob Kirkpatrick do inglês para o português brasileiro.

━━━ DIRETRIZES ABSOLUTAS E INVIOLÁVEIS ━━━

1. NUNCA traduza "dhamma" como "fenômeno". Dhamma = paramattha-dhamma = realidade última discreta e irredutível.
   Mantenha "dhamma" (singular) ou "dhammas" (plural). Em contextos onde é necessário esclarecer, use "realidade".

2. NUNCA use "karma" — sempre "kamma" (forma Pāli correta).

3. Mantenha SEMPRE os seguintes termos Pāli sem traduzir:
   citta, cetasika, rūpa, nibbāna, jhāna, khandha, samatha, vipassanā,
   kusala, akusala, lobha, dosa, moha, sati, paññā, samādhi, nāma,
   sacca, māna, taṇhā, diṭṭhi, avijjā, vedanā, saṅkhāra, viññāṇa,
   mettā, karuṇā, muditā, upekkhā, sīla, Tipiṭaka, Pāli, Dhamma (quando
   se refere ao ensinamento do Buda com D maiúsculo).

4. "Wholesome" = "saudável" / "benéfico" (kammicamente). NUNCA "habilidoso".
   "Unwholesome" = "insalubre" / "prejudicial".

5. "Defilements" = "contaminações"
6. "Arising" = "surgimento" / "surge"
7. "Passing away" / "ceasing" = "cessação" / "cessa"
8. "Consciousness" = "consciência" (quando = citta); "mente" (contexto geral)
9. "Realities" = "realidades" (plural de dhamma em contextos gerais)
10. "Enlightenment" = "iluminação"
11. "Mindfulness" = "atenção pleta" ou "sati"
12. "Craving" = "anseio" ou "taṇhā"
13. "Attachment" = "apego"
14. "Aversion" = "aversão"
15. "Ignorance" = "ignorância" (quando = avijjā); "desconhecimento" aceitável

━━━ MODELO DE ESTILO — REFERÊNCIA REAL ━━━

Use o estilo e vocabulário exatos desta tradução já aprovada (Abhidhamma in Daily Life):

EN: "The Buddha's teachings, contained in the "Tipiṭaka" (Three Baskets) are: the Vinaya (Book of Discipline for the monks), the Suttanta (Discourses) and the Abhidhamma."
PT: "Os ensinamentos do Buda, contidos no "Tipiṭaka" (Três Cestos), são: o Vinaya (Livro da Disciplina para os monges), o Suttanta (Discursos) e o Abhidhamma."

EN: "Seeing is a dhamma, it is real. Colour is a dhamma, it is real. Feeling is a dhamma, it is real."
PT: "Ver é um dhamma, é real. A cor é um dhamma, é real. A sensação é um dhamma, é real."

EN: "We are inclined to take for permanent what is impermanent, for pleasant what is sorrowful and unsatisfactory (dukkha), and for 'self' what is non-self."
PT: "Somos inclinados a tomar por permanente o que é impermanente, por agradável o que é penoso e insatisfatório (dukkha), e por 'eu' o que é não-eu."

EN: "We are reminded of our own attachment (lobha), aversion (dosa) and ignorance (moha); they are realities."
PT: "Somos lembrados de nosso próprio apego (lobha), aversão (dosa) e ignorância (moha); eles são realidades."

EN: "the eightfold Path which leads to the eradication of wrong view, jealousy, stinginess, conceit and all other defilements."
PT: "o caminho óctuplo, que leva à erradicação da visão errada, do ciúme, da avareza, da vaidade e de todas as demais contaminações."

EN: "All three parts of the Tipiṭaka can be an inexhaustible source of inspiration and encouragement to the practice, the development of right understanding of realities."
PT: "Todas as três partes do Tipiṭaka podem ser uma fonte inesgotável de inspiração e encorajamento à prática, ao desenvolvimento da compreensão correta das realidades."

EN: "Although not all the details concerning the processes of cittas can be found in the scriptures themselves, the commentaries are firmly based on the scriptures."
PT: "Embora nem todos os detalhes referentes aos processos de cittas possam ser encontrados nas próprias escrituras, os comentários se baseiam firmemente nas escrituras."

━━━ INSTRUÇÕES FINAIS ━━━

- Tom: acadêmico-devocional, claro, direto, fiel ao original.
- Preserve a pontuação, estrutura de parágrafo e referências (ex: "Book of Fives, chapter VI").
- Preserve marcações HTML como <sup>, <b> sem alteração.
- Retorne SOMENTE a tradução em português. Sem explicações, sem aspas externas, sem prefácio."""


# ──────────────────────────────────────────────
# .env loader
# ──────────────────────────────────────────────

def load_env_file() -> dict:
    env = {}
    if not os.path.exists(ENV_FILE):
        return env
    with open(ENV_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, _, val = line.partition("=")
                env[key.strip()] = val.strip().strip('"').strip("'")
    return env


class GeminiTranslator:
    def __init__(self):
        env = load_env_file()
        self.api_key = env.get("GEMINI_API_KEY", "") or os.environ.get("GEMINI_API_KEY", "")
        if not self.api_key or self.api_key == "sua_chave_aqui":
            print("ERRO: GEMINI_API_KEY não configurada.")
            print(f"Edite: {ENV_FILE}")
            sys.exit(1)

        print(f"  Chave API: {self.api_key[:12]}… (carregada de .env)")
        genai.configure(api_key=self.api_key)
        
        # Lista dos melhores modelos em ordem de preferência
        self.models = [
            "gemini-3.1-pro-preview",
            "gemini-2.5-pro",
            "gemini-3.7-flash",
            "gemini-3.6-flash",
            "gemini-3.5-flash"
        ]
        self.current_idx = 0
        self.model = None
        self._init_model()

    def _init_model(self):
        m_name = self.models[self.current_idx]
        print(f"\n  [API] Ativando modelo: {m_name}")
        self.model = genai.GenerativeModel(
            model_name=m_name,
            system_instruction=SYSTEM_PROMPT,
            generation_config=genai.GenerationConfig(
                temperature=0.2,
                max_output_tokens=2048,
            )
        )

    def generate(self, text: str) -> str:
        if not text.strip():
            return ""
        
        while self.current_idx < len(self.models):
            try:
                resp = self.model.generate_content(text)
                return resp.text.strip()
            except Exception as e:
                err_str = str(e)
                print(f"\n    [ERRO API - {self.models[self.current_idx]}] {err_str}")
                
                # Se for erro de quota (429), não encontrado (404) ou erro interno (50x)
                if any(code in err_str for code in ["429", "404", "403", "500", "503", "quota", "not found"]):
                    self.current_idx += 1
                    if self.current_idx < len(self.models):
                        print(f"    → Alternando para o próximo modelo da lista...")
                        self._init_model()
                        time.sleep(2)
                        continue
                    else:
                        print("    [FALHA FATAL] Todos os modelos se esgotaram.")
                        time.sleep(5)
                        return ""
                else:
                    # Erro de filtro de segurança ou algo desconhecido, apenas pausa
                    time.sleep(5)
                    return ""
        return ""


def setup_gemini():
    return GeminiTranslator()


# ──────────────────────────────────────────────
# Tradução
# ──────────────────────────────────────────────

def translate_text(model_manager, text: str) -> str:
    result = model_manager.generate(text)
    if not result:
        return ""
    
    # Verificações de segurança filológica
    if re.search(r'\bfenômenos?\b', result, re.I) and re.search(r'\bdhamma', text, re.I):
        result = re.sub(r'\bfenômenos\b', 'dhammas', result, flags=re.I)
        result = re.sub(r'\bfenômeno\b',  'dhamma',  result, flags=re.I)
    if re.search(r'\bkarma\b', result, re.I):
        result = re.sub(r'\bkarma\b', 'kamma', result, flags=re.I)
    return result


def needs_translation(seg: dict) -> bool:
    pali = seg.get("pali", "").strip()
    pt   = seg.get("pt",   "").strip()
    rend = seg.get("rend", "bodytext")
    if not pali:
        return False
    if pt:
        return False  # já traduzido
    if rend == "book":
        return False  # título pré-definido
    if rend == "subhead" and pali in ("Nina van Gorkom", "Rob Kirkpatrick"):
        return False
    return True


# ──────────────────────────────────────────────
# Cabeçalhos de capítulo — tradução especial
# ──────────────────────────────────────────────

CHAPTER_TRANSLATIONS = {
    # Capítulos comuns a múltiplos livros
    "Preface":       "Prefácio",
    "Foreword":      "Prefácio",
    "Introduction":  "Introdução",
    "Conclusion":    "Conclusão",
    "Glossary":      "Glossário",
    "Bibliography":  "Bibliografia",
    "Notes":         "Notas",
    "References":    "Referências",
    "Questions":     "Perguntas",
    "Books":         "Livros",
}


def translate_heading(model, text: str) -> str:
    """Traduz cabeçalho — tenta cache estático primeiro."""
    if text in CHAPTER_TRANSLATIONS:
        return CHAPTER_TRANSLATIONS[text]
    # Capítulos numerados: "1 The Nature of Cittas" → traduz
    return translate_text(model, text)


# ──────────────────────────────────────────────
# Processamento de um livro
# ──────────────────────────────────────────────

def get_chunk_files(work_dir: str) -> list:
    return sorted(
        f for f in os.listdir(work_dir)
        if f.startswith("texto") and f.endswith(".json") and f != "index.json"
    )


def process_book(model, book_id: str) -> dict:
    work_dir = os.path.join(DAT_DIR, book_id)
    if not os.path.isdir(work_dir):
        print(f"ERRO: diretório não encontrado: {work_dir}")
        print("Rode primeiro: python3 scripts/integrate_books.py")
        sys.exit(1)

    chunk_files = get_chunk_files(work_dir)
    if not chunk_files:
        print(f"ERRO: nenhum arquivo texto*.json em {work_dir}")
        sys.exit(1)

    stats = {"translated": 0, "already_done": 0, "empty": 0, "total": 0}

    for fname in chunk_files:
        fpath = os.path.join(work_dir, fname)
        print(f"\n  Chunk: {fname}")

        with open(fpath, encoding="utf-8") as f:
            segments = json.load(f)

        modified = False

        for i, seg in enumerate(segments):
            stats["total"] += 1

            if not needs_translation(seg):
                if seg.get("pt"):
                    stats["already_done"] += 1
                else:
                    stats["empty"] += 1
                continue

            en_text = seg["pali"]
            rend    = seg.get("rend", "bodytext")

            # Exibe progresso
            preview = en_text[:70].replace("\n", " ")
            print(f"    [{seg['id']:4d}|{rend:10s}] {preview}…")

            # Traduz
            if rend in ("chapter", "subhead"):
                pt_text = translate_heading(model, en_text)
            else:
                pt_text = translate_text(model, en_text)

            if pt_text:
                seg["pt"] = pt_text
                modified  = True
                stats["translated"] += 1
                print(f"           → {pt_text[:70]}…")
            else:
                print(f"           → [FALHOU — mantendo vazio]")

            # Salva a cada 20 segmentos
            if stats["translated"] % 20 == 0 and modified:
                with open(fpath, "w", encoding="utf-8") as f:
                    json.dump(segments, f, ensure_ascii=False, indent=2)
                print(f"    [salvo] checkpoint em {fname}")

            # Rate limiting
            time.sleep(0.3)

        if modified:
            with open(fpath, "w", encoding="utf-8") as f:
                json.dump(segments, f, ensure_ascii=False, indent=2)

    return stats


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 scripts/translate_books.py <book-id>")
        print("\nLivros disponíveis (na ordem):")
        for bid, title in BOOK_ORDER:
            work_dir = os.path.join(DAT_DIR, bid)
            status   = "✅ integrado" if os.path.isdir(work_dir) else "⏳ não integrado"
            print(f"  {bid:<50} {title}  [{status}]")
        print("\nExemplo: python3 scripts/translate_books.py buddhism-in-daily-life")
        sys.exit(0)

    book_id = sys.argv[1]

    # Valida id
    valid_ids = [bid for bid, _ in BOOK_ORDER]
    if book_id not in valid_ids:
        # Tenta match parcial
        matches = [bid for bid in valid_ids if book_id in bid]
        if len(matches) == 1:
            book_id = matches[0]
            print(f"  → Resolvido: {book_id}")
        elif len(matches) > 1:
            print(f"Ambíguo — matches: {matches}")
            sys.exit(1)
        else:
            print(f"ID não encontrado: {book_id}")
            print(f"IDs válidos: {valid_ids}")
            sys.exit(1)

    title = dict(BOOK_ORDER)[book_id]
    print(f"\n{'='*60}")
    print(f"  Traduzindo: {title}")
    print(f"  ID:         {book_id}")
    print(f"{'='*60}\n")

    print("Configurando Gemini…")
    model = setup_gemini()

    stats = process_book(model, book_id)

    print(f"\n{'='*60}")
    print(f"  Concluído: {title}")
    print(f"  Traduzidos agora:  {stats['translated']}")
    print(f"  Já prontos antes:  {stats['already_done']}")
    print(f"  Sem texto (skip):  {stats['empty']}")
    print(f"  Total segmentos:   {stats['total']}")
    print(f"{'='*60}")

    # Próximo livro na ordem
    ids = [bid for bid, _ in BOOK_ORDER]
    if book_id in ids:
        idx = ids.index(book_id)
        if idx + 1 < len(ids):
            next_id, next_title = BOOK_ORDER[idx + 1]
            print(f"\n  Próximo livro: {next_title}")
            print(f"  Comando:       python3 scripts/translate_books.py {next_id}")
        else:
            print("\n  ✅ Todos os livros concluídos!")
            print("  Rode: python3 scripts/build_search_index.py")
            print("  Rode: npm run build")


if __name__ == "__main__":
    main()
