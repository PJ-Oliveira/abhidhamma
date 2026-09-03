import { Niggahatthana } from './kathavatthu.js';
export const AtthakathaOntology = {
    'puggala': {
        school: 'Puggalavāda (Vajjiputtakas / Sammitīyas)',
        historicalContext: 'Emerged around 200 years after the Parinibbāna. They attempted to create an intermediate entity between conventional and ultimate truth.',
        doctrinalError: 'They confused the Buddha\'s conventional language (vohāra-desanā) with ontological reality (paramattha-desanā), claiming the Person transmigrates.',
        anutikaLogic: 'In the Anuṭīkā, the refutation uses Reductio ad Absurdum (Āpādanā): If the person exists in an ultimate sense, it must be either identical to or completely distinct from the 5 aggregates. If identical, it is impermanent (destroying the concept of a soul). If distinct, it must be apprehendable without the aggregates, which violates direct experience. It breaks the law of excluded middle.',
        pedagogicalAnalogy: 'Chariot Analogy (Ratha-vinīta / Milindapañhā): Just as the word "chariot" is merely a concept (paññatti) applied when the axle, wheels, and frame are assembled, the word "Person" is a label applied when the 5 Aggregates (Khandhas) are present. There is no independent "chariot".',
        detailedSyllogismBreakdown: 'If you didn\'t understand step 4 (Upanaya): It means that if we look for the "Person" with the precision of a microscope (Vipassanā vision), we will find only Form (Rūpa), Feeling (Vedanā), Perception (Saññā), Formations (Saṅkhārā), and Consciousness (Viññāṇa). There is no sixth piece called "Person". Thus, the original argument fails on its empirical basis.'
    },
    'kāla': {
        school: 'Sabbatthivādins (Sarvāstivādins)',
        historicalContext: 'Claimed that dhammas exist in the three times (past, present, future) simultaneously.',
        doctrinalError: 'Reified "time" (kāla) as an absolute dhamma. The Theravāda argues that time is merely a concept (paññatti) deduced from the continuous succession (uppāda-ṭhiti-bhaṅga) of real dhammas, not an entity.',
        anutikaLogic: 'The Anuṭīkā dismantles the reification of time by proving that a dhamma cannot possess two ontological states (e.g., existing in the past and in the present) without its Sabhāva (intrinsic nature) being mutable, which nullifies the very concept of a paramattha dhamma.',
        pedagogicalAnalogy: 'Shadow Analogy: Time is not the "box" where events happen. It is like the shadow of a growing tree. The shadow (time) only exists conceptually because of the tree (real phenomena arising and passing away). If you remove the phenomena, no independent temporal dimension remains.',
        detailedSyllogismBreakdown: 'The Syllogism proves that if "The past exists" (as opponents claim), then the past hasn\'t stopped existing. But the definition of past is exactly that which has "ceased". It is a fatal logical contradiction (Paṭiññāvirodho). The opponent is forced to admit that A cannot be ¬A at the same time.'
    }
};
export function getCommentaryExplanation(subject, defeatType) {
    const context = AtthakathaOntology[subject.toLowerCase()];
    if (!context) {
        return 'O Comentário (Aṭṭhakathā / Anuṭīkā) não registra um contexto específico para este argumento nesta base de dados.';
    }
    if (defeatType === Niggahatthana.PATINNAYAVIRODHO) {
        return `A escola ${context.school} foi refutada neste ponto pelo Aṭṭhakathā: ${context.doctrinalError} \nDe acordo com a Lógica Formal do Anuṭīkā: ${context.anutikaLogic}`;
    }
    return `Historicamente, a escola ${context.school} defendeu visões correlatas. ${context.historicalContext} \nFoco Analítico da Anuṭīkā: ${context.anutikaLogic}`;
}
//# sourceMappingURL=commentary.js.map