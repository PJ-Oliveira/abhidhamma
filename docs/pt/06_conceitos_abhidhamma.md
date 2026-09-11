# Conceitos Abhidhamma

Esta página fornece uma referência dos principais termos Abhidhamma como aparecem no código-fonte, nos dados e na interface do usuário.

---

## 1. Piṭakas e o Cânone Pāli

O Cânone Pāli (Tipiṭaka) tem três divisões:

| Piṭaka | Conteúdo |
|---|---|
| Vinaya Piṭaka | Regras monásticas |
| Sutta Piṭaka | Discursos do Buda |
| Abhidhamma Piṭaka | Análise psicológica e filosófica sistemática |

Este projeto cobre principalmente o **Abhidhamma Piṭaka** e textos relacionados.

---

## 2. Os Sete Livros do Abhidhamma

| Chave `workId` | Título Pāli | Conteúdo |
|---|---|---|
| `dhammasangani` | Dhammasaṅgaṇī | Enumeração dos fenômenos (dhammas) |
| `vibhanga` | Vibhaṅga | Análise dos grupos (khandhas, āyatanas, etc.) |
| `dhatukatha` | Dhātukathā | Discussão dos elementos |
| `puggalapannatti` | Puggalapaññatti | Descrição de tipos de pessoas |
| `kathavatthu` | Kathāvatthu | Pontos de controvérsia (debates inter-escolares) |
| `yamaka` | Yamaka | Pares de questões |
| `patthana` | Paṭṭhāna | Relações condicionais (o maior livro do cânone) |

---

## 3. Conceitos Centrais

### Sammuti vs. Paramattha

- **Sammuti** (convencional): entidades cotidianas como "pessoa", "montanha", "carro" — reais para propósitos práticos, mas não em última análise.
- **Paramattha** (último): realidades irredutíveis — citta, cetasika, rūpa, nibbāna. O Abhidhamma opera principalmente no nível paramattha.

### Os Quatro Paramattha Dhammas

| Termo | Tradução | Descrição |
|---|---|---|
| Citta | Consciência | Mente que conhece um objeto |
| Cetasika | Fatores mentais | 52 qualidades mentais que acompanham a consciência |
| Rūpa | Matéria/Forma | 28 tipos de fenômenos materiais |
| Nibbāna | Nirvana | Cessação do sofrimento; incondicionado |

---

## 4. Citta (Consciência)

O Abhidhamma classifica **89 (ou 121) tipos de citta** em quatro planos:

| Plano | Cittas |
|---|---|
| Kāmāvacara | Esfera sensual (54 tipos) |
| Rūpāvacara | Esfera da forma (15 tipos) |
| Arūpāvacara | Esfera sem forma (12 tipos) |
| Lokuttara | Supramundano (8 ou 40 tipos) |

Cada citta pode ser saudável (kusala), insalubre (akusala), resultante (vipāka) ou funcional (kiriya).

---

## 5. Cetasika (Fatores Mentais)

52 cetasikas surgem com cittas em combinações específicas:

| Grupo | Cetasikas |
|---|---|
| Universais (Sabbacittasādhāraṇa) | 7 — surgem com todos os cittas |
| Particulares (Pakiṇṇaka) | 6 — surgem com alguns cittas |
| Insalubres (Akusala) | 14 — associados com cittas akusala |
| Lindos (Sobhaṇa) | 25 — associados com cittas lindos/saudáveis |

A ferramenta **Cetasika** (`tools/cetasika.ts`) mapeia quais cetasikas surgem com cada citta e permite comparações lado a lado.

---

## 6. Citta-Vīthi (Processo de Consciência)

Momentos de consciência surgem em sequências (vīthi) através de diferentes **portas** (dvāra):

| Porta | Órgão sensorial | Sequência típica |
|---|---|---|
| Cakkhu-dvāra | Olho | Advertência → visão × 5 → recepção → investigação → determinação → javana × 7 → registro × 2 |
| Sota-dvāra | Ouvido | (similar ao acima) |
| Ghāna-dvāra | Nariz | (similar) |
| Jivhā-dvāra | Língua | (similar) |
| Kāya-dvāra | Corpo | (similar) |
| Mano-dvāra | Porta da mente | Bhavaṅga → interrupção → advertência → javana × 7 → registro × 2 |

A ferramenta **Citta-Vīthi** (`tools/vithi.ts`) anima essas sequências com base em dados de `data/tools/vithi.json`.

---

## 7. Khandha (Grupos / Agregados)

As cinco categorias de existência experiencial:

| Pāli | Tradução |
|---|---|
| Rūpa-khandha | Forma material |
| Vedanā-khandha | Sentimento (agradável/desagradável/neutro) |
| Saññā-khandha | Percepção |
| Saṅkhāra-khandha | Formações volitivas |
| Viññāṇa-khandha | Consciência |

---

## 8. As 24 Relações Condicionais do Paṭṭhāna (Paccaya)

O **Paṭṭhāna** enumera 24 tipos de relações condicionais (paccaya) entre dhammas. A ferramenta **Paṭṭhāna** (`tools/patthana.ts`) visualiza essas relações interativamente.

Alguns exemplos-chave:

| # | Pāli | Tradução |
|---|---|---|
| 1 | Hetu-paccaya | Condição raiz |
| 2 | Ārammaṇa-paccaya | Condição objeto |
| 3 | Adhipati-paccaya | Condição dominante |
| 4 | Anantara-paccaya | Condição imediatamente contígua |
| 6 | Sahajāta-paccaya | Condição co-nascente |
| 8 | Nissaya-paccaya | Condição de apoio |
| 11 | Āhāra-paccaya | Condição nutrição |
| 17 | Magga-paccaya | Condição caminho |
| 24 | Vippayutta-paccaya | Condição dissociada |

---

## 9. Mātikā (Matriz de Classificação)

O Dhammasaṅgaṇī abre com a **Mātikā** — uma matriz de **122 grupos**:

- **Tika-mātikā**: 22 tríades (agrupamentos de três) — ex: kusala/akusala/abyākata (saudável/insalubre/inefável)
- **Duka-mātikā**: 100 díades (agrupamentos de dois) — ex: hetu/na-hetu (com raiz/sem raiz)

A ferramenta **Mātikās** (`tools/matikas.ts`) torna esses grupos pesquisáveis.

---

## 10. Kathāvatthu e o Motor Lógico de Debate

A **Kathāvatthu** (Pontos de Controvérsia) é um registro de debates filosóficos entre escolas budistas. Seu formato de debate tem um padrão de 5 passos:

1. **Afirmação** (puggalo upalabbhati): "A pessoa existe em última instância?"
2. **Refutação** (na h'evaṃ vattabbe): "Isso não pode ser dito assim"
3. **Consequência lógica** (se X então Y segue-se)
4. **Reductio ad absurdum**
5. **Contraposição** (o oponente concorda com o absurdo, portanto a tese original cai)

O módulo `ontology/kathavatthu_logic.ts` implementa este padrão como um motor baseado em regras com:
- `KathavatthuRule`: enum de tipos de regras lógicas
- `LogicalConnective`: enum de conectivos (IMPLIES, IFF, NOT, AND, OR)
- `evaluateCustomClaim(claim)`: avalia uma afirmação arbitrária
- `evaluateScenario(scenarioId, uiLang)`: avalia cenários canônicos pré-codificados

---

## 11. Khaṇikavāda (Momentariedade)

A doutrina Abhidhamma de que toda experiência consiste em momentos de consciência distintos (khaṇa) que surgem e passam em rapidíssima sucessão. Cada citta na vīthi é um momento separado. Essa doutrina é um dos tópicos debatidos no simulador da Kathāvatthu.
