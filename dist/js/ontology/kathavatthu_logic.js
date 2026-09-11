export var LogicalConnective;
(function (LogicalConnective) {
    LogicalConnective["IF"] = "Sace";
    LogicalConnective["THEN"] = "Tena vata re vattabbe";
    LogicalConnective["AND"] = "Ca";
    LogicalConnective["NOT"] = "Na";
    LogicalConnective["IS_EQUAL"] = "Tatheva";
    LogicalConnective["IS_NOT_EQUAL"] = "A\u00F1\u00F1o";
})(LogicalConnective || (LogicalConnective = {}));
export var KathavatthuRule;
(function (KathavatthuRule) {
    KathavatthuRule["ANULOMA"] = "Anuloma (Forward progression)";
    KathavatthuRule["PATIKAMMA"] = "Pa\u1E6Dikamma (Counter-argument)";
    KathavatthuRule["NIGGAHA"] = "Niggaha (Refutation)";
    KathavatthuRule["UPANAYANA"] = "Upanayana (Application)";
    KathavatthuRule["NITTHANA"] = "Ni\u1E6D\u1E6Dh\u0101na (Conclusion)";
    KathavatthuRule["PACCANIKA"] = "Paccan\u012Bka (Contrary / Inverse)";
})(KathavatthuRule || (KathavatthuRule = {}));
export function evaluateCustomClaim(claimText) {
    const text = claimText.toLowerCase();
    if (text.includes('self') || text.includes('person') || text.includes('soul') || text.includes('atman') || text.includes('jiva')) {
        return {
            verdict: 'Paṭiññāvirodho (Contradicting the Proposition)',
            history: 'The opponent claims a conventional truth (Sammuti-sacca) exists in an ultimate sense (Paramattha-sacca).',
            metaLogic: `Applying ${KathavatthuRule.ANULOMA} and ${KathavatthuRule.PATIKAMMA}. Evaluating using Law of Excluded Middle.`,
            paradox: `<em>"If the Self is identical to the aggregates, it is impermanent. If distinct, it must be apprehendable independently. Neither is true."</em>`,
            logic: `
1. <strong>${KathavatthuRule.ANULOMA}:</strong> ${LogicalConnective.IF} the Self exists in an ultimate sense, ${LogicalConnective.THEN} it must be found as a distinct Paramattha Dhamma.
2. <strong>${KathavatthuRule.PATIKAMMA}:</strong> ${LogicalConnective.NOT} found as Rūpa, Vedanā, Saññā, Saṅkhārā, or Viññāṇa.
3. <strong>${KathavatthuRule.NIGGAHA}:</strong> Therefore, the Self is ${LogicalConnective.NOT} an ultimate reality.
4. <strong>${KathavatthuRule.UPANAYANA}:</strong> You cannot assert the Self exists ultimately ${LogicalConnective.AND} admit it is not found in the Aggregates.
5. <strong>${KathavatthuRule.NITTHANA}:</strong> The proposition is false.
            `,
            pedagogicalAnalogy: 'Chariot Analogy (Ratha-vinīta): Just as "chariot" is a concept applied when parts are assembled, "Self" is a label for the 5 Aggregates.',
            detailedSyllogismBreakdown: 'By applying strict boolean logic, if A (Self) exists, it must map to an element in set B (Aggregates). A ∉ B, therefore A = ∅ (null) in ultimate reality.'
        };
    }
    if (text.includes('time') || text.includes('past') || text.includes('future') || text.includes('kala')) {
        return {
            verdict: 'Paṭiññāvirodho (Contradicting the Proposition)',
            history: 'The opponent reifies Time as an absolute entity.',
            metaLogic: `Applying ${KathavatthuRule.PACCANIKA}. Evaluating Law of Non-Contradiction.`,
            paradox: `<em>"If the past exists, it has not ceased. But 'past' means that which has ceased."</em>`,
            logic: `
1. <strong>${KathavatthuRule.ANULOMA}:</strong> ${LogicalConnective.IF} the Past exists, ${LogicalConnective.THEN} it must retain its intrinsic nature (Sabhāva).
2. <strong>${KathavatthuRule.PATIKAMMA}:</strong> But the intrinsic nature of the past is that it has ceased.
3. <strong>${KathavatthuRule.NIGGAHA}:</strong> It is ${LogicalConnective.NOT} possible for something to exist ${LogicalConnective.AND} have ceased.
4. <strong>${KathavatthuRule.UPANAYANA}:</strong> You contradict yourself.
5. <strong>${KathavatthuRule.NITTHANA}:</strong> The proposition is false.
            `,
            pedagogicalAnalogy: 'Shadow Analogy: Time only exists conceptually because of real phenomena arising and passing away.',
            detailedSyllogismBreakdown: 'Time is a paññatti (concept). Reifying it leads to a logical contradiction (A = ¬A).'
        };
    }
    if ((text.includes('citta') || text.includes('consciousness') || text.includes('mind') || text.includes('vinnana')) &&
        (text.includes('transmigrate') || text.includes('endure') || text.includes('permanent') || text.includes('same') || text.includes('momentary') || text.includes('momentaneo') || text.includes('series'))) {
        return {
            verdict: 'Apasiddhantaraṃ (Deviation from Doctrine)',
            history: 'The opponent (similar to Sāti the fisherman in the Mahātaṇhāsaṅkhaya Sutta) claims that the exact same consciousness transmigrates, denying dependent origination and the momentariness (Khaṇikavāda) of Citta.',
            metaLogic: `Applying ${KathavatthuRule.PACCANIKA}. Evaluating Law of Dependent Origination (Paṭiccasamuppāda).`,
            paradox: `<em>"If consciousness is the same entity traversing lives, it must be independent of conditions. If it depends on conditions, it cannot be the same entity."</em>`,
            logic: `
1. <strong>${KathavatthuRule.ANULOMA}:</strong> ${LogicalConnective.IF} this exact same Citta endures and transmigrates, ${LogicalConnective.THEN} it must arise without causes and conditions.
2. <strong>${KathavatthuRule.PATIKAMMA}:</strong> But the Buddha taught that Citta arises strictly dependent on conditions (e.g., Eye + Form = Eye-Consciousness).
3. <strong>${KathavatthuRule.NIGGAHA}:</strong> Therefore, it is ${LogicalConnective.NOT} the same Citta enduring.
4. <strong>${KathavatthuRule.UPANAYANA}:</strong> You cannot assert Citta is a transmigrating entity ${LogicalConnective.AND} simultaneously accept Paṭiccasamuppāda.
5. <strong>${KathavatthuRule.NITTHANA}:</strong> The proposition is false. Citta is a rapid succession of momentary (khaṇika) events.
            `,
            pedagogicalAnalogy: 'River Analogy (Nadi-sota): A river looks like a single continuous entity, but it is constantly new water flowing. Citta is a stream of rapidly arising and passing moments, not a single enduring traveler.',
            detailedSyllogismBreakdown: 'Consciousness (Citta) is a process (vīthi), not an object. The logical contradiction lies in assigning static identity (A = A) to a dynamically conditioned variable (A = function(conditions)).'
        };
    }
    if ((text.includes('sabhava') || text.includes('nature') || text.includes('characteristic') || text.includes('lakkhana') || text.includes('own-nature')) &&
        (text.includes('specific') || text.includes('general') || text.includes('form') || text.includes('different') || text.includes('same'))) {
        return {
            verdict: 'Paṭiññāntaraṃ (Shifting the Proposition) / Hetvābhāsā (Fallacious Reason)',
            history: 'The opponent conflates General Characteristics (Sāmañña-lakkhaṇa: anicca, dukkha, anatta) with Specific Characteristics (Sabhāva-lakkhaṇa / Visesa-lakkhaṇa). This argument is a hallmark of Abhidhammika sub-commentarial (Anuṭīkā) dialectics.',
            metaLogic: `Applying ${KathavatthuRule.NIGGAHA} via Dhammaniyāma (Ontological Law of Specificity).`,
            paradox: `<em>"If two phenomena share a general characteristic, are they the same entity? If yes, then Earth is Water because both are impermanent. If no, then why conflate them?"</em>`,
            logic: `
1. <strong>${KathavatthuRule.ANULOMA}:</strong> ${LogicalConnective.IF} two Dhammas share the general characteristic of impermanence, ${LogicalConnective.THEN} they are equivalent in that respect (sāmañña).
2. <strong>${KathavatthuRule.PATIKAMMA}:</strong> But the opponent conflates this general equivalence with ontological identity, ignoring that Earth (Pathavī) has the specific characteristic of hardness, while Water (Āpo) has cohesion.
3. <strong>${KathavatthuRule.NIGGAHA}:</strong> Therefore, they are ${LogicalConnective.IS_NOT_EQUAL} as entities. One thing is never found with the form (sabhāva) of another.
4. <strong>${KathavatthuRule.UPANAYANA}:</strong> You cannot assert identity based on general characteristics ${LogicalConnective.AND} ignore specific characteristics.
5. <strong>${KathavatthuRule.NITTHANA}:</strong> The proposition is logically flawed.
            `,
            pedagogicalAnalogy: 'Salt and Sugar Analogy: Both salt and sugar are white powders that dissolve in water (general characteristic). But one is salty, the other is sweet (specific characteristic). They can never swap their intrinsic nature (sabhāva).',
            detailedSyllogismBreakdown: 'In set theory, two elements a and b can belong to the same universal set U (Impermanent things). However, a ≠ b if the property function P(a) ≠ P(b). A general characteristic is a shared set membership; a specific characteristic is the unique identifier.'
        };
    }
    if ((text.includes('cause') || text.includes('basis') || text.includes('self') || text.includes('atman')) &&
        (text.includes('simultaneous') || text.includes('arise') || text.includes('happiness') || text.includes('independent') || text.includes('origination'))) {
        return {
            verdict: 'Asambandhatthaṃ (The Incoherent) / Hetvābhāsā (Fallacious Reason)',
            history: 'The opponent posits a permanent entity (Self, Īśvara, Creator) as the basis or cause for temporary experiences (like happiness). This classic refutation appears in Theravāda and Buddhist Pramāṇa (epistemology) texts.',
            metaLogic: `Applying ${KathavatthuRule.UPANAYANA}. Refuting Asaṅkhata-Kāraṇa-Vāda (Unconditioned Cause Theory) via Kāraṇaniyāma.`,
            paradox: `<em>"If a cause is permanent and independent, it never changes. If it never changes, its effect must be produced continuously and simultaneously. But we observe sequential, temporary effects."</em>`,
            logic: `
1. <strong>${KathavatthuRule.ANULOMA}:</strong> ${LogicalConnective.IF} a permanent, independent Self is the cause of happiness, ${LogicalConnective.THEN} the cause is always present in its entirety.
2. <strong>${KathavatthuRule.PATIKAMMA}:</strong> If the cause is fully present and requires no other conditions, the effect must arise completely and simultaneously at all times.
3. <strong>${KathavatthuRule.NIGGAHA}:</strong> But happiness arises and ceases sequentially, depending on contact (phassa).
4. <strong>${KathavatthuRule.UPANAYANA}:</strong> You cannot assert a permanent independent cause ${LogicalConnective.AND} account for sequential, temporary effects.
5. <strong>${KathavatthuRule.NITTHANA}:</strong> The proposition collapses. The cause must be as momentary and conditioned as the effect.
            `,
            pedagogicalAnalogy: 'The Seed and the Sprout: A sprout does not appear instantly just because a seed exists. It requires sequential conditions (water, soil, time). A "permanent" seed that doesn\'t undergo change could never trigger the event of sprouting.',
            detailedSyllogismBreakdown: 'If Cause C is a constant (C = 1) and independent, then Effect E must also be a constant (E = 1). Since empirical observation shows E is a variable (E(t) over time), C cannot be a constant. Therefore, a permanent basis for temporary phenomena is mathematically impossible.'
        };
    }
    return {
        verdict: 'Aviññātatthaṃ (The Unintelligible)',
        history: 'Custom arguments are evaluated dynamically using Kathāvatthu principles.',
        metaLogic: 'Evaluating Hetvābhāsā (Fallacious Reason) and Double Negation parameters...',
        paradox: '<em>Pending heuristic mapping to specific Abhidhamma categories...</em>',
        logic: 'Insufficient ontological keywords to construct formal syllogism (Anuloma/Paṭikamma). Try mentioning "self", "soul", or "time".',
        pedagogicalAnalogy: 'Waiting for more specific ontological assertions to compare against the Abhidhamma matrices.',
        detailedSyllogismBreakdown: 'Please provide a clearer proposition (e.g., "The soul transmigrates" or "Time is absolute").'
    };
}
import { CanonicalScenarios } from '../ai-feature/debate-scenarios.js';
import { AtthakathaOntology } from './commentary.js';
export function evaluateScenario(scenarioId, lang = 'en') {
    const scenario = CanonicalScenarios.find(s => s.id === scenarioId);
    if (!scenario)
        return evaluateCustomClaim("");
    const getL = (obj, defaultText) => {
        if (!obj)
            return defaultText;
        if (typeof obj === 'string')
            return obj;
        return obj[lang] || obj['en'] || defaultText;
    };
    let verdict = 'Aviññātatthaṃ (The Unintelligible)';
    const oppLabel = lang === 'pt' ? 'Escola Oponente' : (lang === 'es' ? 'Escuela Oponente' : 'Opponent School');
    let history = `<strong>${oppLabel}:</strong> ${getL(scenario.opponentSchool, 'Unknown')}<br><br>${getL(scenario.commentaryContext, 'Context loaded from Aṭṭhakathā.')}`;
    let metaLogic = getL(scenario.metaLogic, 'Applying standard binary evaluation (Law of Excluded Middle).');
    let paradox = 'Pending heuristic evaluation...';
    let logic = 'Pending formal syllogism structure...';
    let pedagogicalAnalogy = 'N/A';
    let detailedSyllogismBreakdown = 'N/A';
    if (scenarioId === 'puggala_vada') {
        const ctx = AtthakathaOntology['puggala'];
        verdict = 'Paṭiññāvirodho (Contradicting the Proposition)';
        if (lang === 'pt') {
            paradox = `<em>"Se a entidade for idêntica aos agregados, é impermanente. Se for distinta, deve ser apreensível de forma independente. Nenhuma das duas opções é verdadeira."</em>`;
            logic = `
1. <strong>Paṭiññā (Proposição):</strong> A Pessoa (Puggala) é conhecida num sentido último.
2. <strong>Hetu (Razão):</strong> Porque o Buda usou o termo "Pessoa".
3. <strong>Udāharaṇa (Exemplo):</strong> Como o termo "Citta" (Consciência).
4. <strong>Upanaya (Aplicação):</strong> Mas a Pessoa não pode ser classificada dentro dos 5 Agregados.
5. <strong>Niggamana (Conclusão):</strong> Portanto, a Proposição é falsa.
            `;
            pedagogicalAnalogy = ctx?.pedagogicalAnalogy || 'N/A';
            detailedSyllogismBreakdown = ctx?.detailedSyllogismBreakdown || 'N/A';
        }
        else if (lang === 'es') {
            paradox = `<em>"Si la entidad es idéntica a los agregados, es impermanente. Si es distinta, debe ser aprehensible de forma independiente. Ninguna de las dos es cierta."</em>`;
            logic = `
1. <strong>Paṭiññā (Proposición):</strong> La Persona (Puggala) se conoce en un sentido último.
2. <strong>Hetu (Razón):</strong> Porque el Buda usó el término "Persona".
3. <strong>Udāharaṇa (Ejemplo):</strong> Como el término "Citta" (Conciencia).
4. <strong>Upanaya (Aplicación):</strong> Pero la Persona no puede ser clasificada dentro de los 5 Agregados.
5. <strong>Niggamana (Conclusión):</strong> Por lo tanto, la Proposición es falsa.
            `;
            pedagogicalAnalogy = ctx?.pedagogicalAnalogy || 'N/A';
            detailedSyllogismBreakdown = ctx?.detailedSyllogismBreakdown || 'N/A';
        }
        else {
            paradox = `<em>"If the entity is identical to the aggregates, it is impermanent. If distinct, it must be apprehendable independently. Neither is true."</em>`;
            logic = `
1. <strong>Paṭiññā (Proposition):</strong> The Person (Puggala) is known in an ultimate sense.
2. <strong>Hetu (Reason):</strong> Because the Buddha used the term "Person".
3. <strong>Udāharaṇa (Example):</strong> Like the term "Citta" (Consciousness).
4. <strong>Upanaya (Application):</strong> But the Person cannot be classified within the 5 Aggregates.
5. <strong>Niggamana (Conclusion):</strong> Therefore, the Proposition is false.
            `;
            pedagogicalAnalogy = ctx?.pedagogicalAnalogy || 'N/A';
            detailedSyllogismBreakdown = ctx?.detailedSyllogismBreakdown || 'N/A';
        }
    }
    else if (scenarioId === 'kāla_vada') {
        const ctx = AtthakathaOntology['kāla'];
        verdict = 'Paṭiññāvirodho (Contradicting the Proposition)';
        if (lang === 'pt') {
            paradox = `<em>"Se o passado existe, ele não cessou. Mas 'passado' significa aquilo que cessou."</em>`;
            logic = `
1. <strong>Paṭiññā (Proposição):</strong> O tempo existe num sentido último.
2. <strong>Hetu (Razão):</strong> Porque as coisas acontecem no passado, presente e futuro.
3. <strong>Upanaya (Aplicação):</strong> Mas se um Dhamma existe no passado e no presente, a sua natureza intrínseca (Sabhāva) mudou.
4. <strong>Niggamana (Conclusão):</strong> Portanto, o Tempo é um conceito (Paññatti), não uma realidade última.
            `;
        }
        else if (lang === 'es') {
            paradox = `<em>"Si el pasado existe, no ha cesado. Pero 'pasado' significa aquello que ha cesado."</em>`;
            logic = `
1. <strong>Paṭiññā (Proposición):</strong> El tiempo existe en un sentido último.
2. <strong>Hetu (Razón):</strong> Porque las cosas suceden en el pasado, presente y futuro.
3. <strong>Upanaya (Aplicación):</strong> Pero si un Dhamma existe en el pasado y en el presente, su naturaleza intrínseca (Sabhāva) ha cambiado.
4. <strong>Niggamana (Conclusión):</strong> Por lo tanto, el Tiempo es un concepto (Paññatti), no una realidad última.
            `;
        }
        else {
            paradox = `<em>"If the past exists, it has not ceased. But 'past' means that which has ceased."</em>`;
            logic = `
1. <strong>Paṭiññā (Proposition):</strong> Time exists in an ultimate sense.
2. <strong>Hetu (Reason):</strong> Because things happen in the past, present, and future.
3. <strong>Upanaya (Application):</strong> But if a Dhamma exists in the past and present, its intrinsic nature (Sabhāva) mutated.
4. <strong>Niggamana (Conclusion):</strong> Therefore, Time is a concept (Paññatti), not an ultimate reality.
            `;
        }
        pedagogicalAnalogy = ctx?.pedagogicalAnalogy || 'N/A';
        detailedSyllogismBreakdown = ctx?.detailedSyllogismBreakdown || 'N/A';
    }
    else if (scenarioId === 'sassata_vada') {
        verdict = 'Apasiddhantaraṃ (Deviation from Doctrine)';
        if (lang === 'pt') {
            paradox = `<em>"Se a alma é eterna e separada, as ações do corpo não a afetam, anulando o kamma."</em>`;
            logic = `
1. <strong>Anuloma:</strong> Se a alma é eterna, ela não muda.
2. <strong>Paṭikamma:</strong> Se não muda, não pode experienciar sofrimento ou libertação.
3. <strong>Niggaha:</strong> Contradiz a lei da Originação Dependente (Paṭiccasamuppāda).
            `;
            pedagogicalAnalogy = 'Analogia do Fogo: Um fogo depende do combustível. Sem combustível, ele não vai "para algum lugar eterno", ele cessa. O mesmo ocorre com a consciência.';
            detailedSyllogismBreakdown = 'Se a Alma = Eterna, então ∆Alma = 0. Mas o Kamma exige ∆. Assim, Kamma = 0. Isso destrói a estrutura ética Budista.';
        }
        else if (lang === 'es') {
            paradox = `<em>"Si el alma es eterna y separada, las acciones del cuerpo no pueden afectarla, anulando el kamma."</em>`;
            logic = `
1. <strong>Anuloma:</strong> Si el alma es eterna, no cambia.
2. <strong>Paṭikamma:</strong> Si no cambia, no puede experimentar sufrimiento o liberación.
3. <strong>Niggaha:</strong> Contradice la ley de Origen Dependiente (Paṭiccasamuppāda).
            `;
            pedagogicalAnalogy = 'Analogía del Fuego: Un fuego depende del combustible. Sin combustible, no va "a un lugar eterno", cesa. Lo mismo ocurre con la conciencia.';
            detailedSyllogismBreakdown = 'Si Alma = Eterna, entonces ∆Alma = 0. Pero el Kamma requiere ∆. Así, Kamma = 0. Esto destruye el marco ético Budista.';
        }
        else {
            paradox = `<em>"If the soul is eternal and separate, the body's actions cannot affect it, making kamma null."</em>`;
            logic = `
1. <strong>Anuloma:</strong> If the soul is eternal, it does not change.
2. <strong>Paṭikamma:</strong> If it does not change, it cannot experience suffering or liberation.
3. <strong>Niggaha:</strong> It contradicts the law of Dependent Origination (Paṭiccasamuppāda).
            `;
            pedagogicalAnalogy = 'Fire Analogy: A fire depends on fuel. Without fuel, it does not go "somewhere eternal", it ceases. Likewise, consciousness depends on conditions.';
            detailedSyllogismBreakdown = 'If Soul = Eternal, then ∆Soul = 0. But Kamma requires ∆. Thus, Kamma = 0. This destroys the Buddhist ethical framework.';
        }
    }
    else if (scenarioId === 'ekacca_sassata_vada') {
        verdict = 'Apasiddhantaraṃ (Deviation from Doctrine)';
        if (lang === 'pt') {
            paradox = '<em>"Se a Mente é eterna mas o Corpo impermanente, como um observador eterno interage com um objeto momentâneo sem se alterar?"</em>';
            logic = `
1. <strong>Anuloma:</strong> Se o Citta (Mente) é eterno, não surge nem cessa.
2. <strong>Paṭikamma:</strong> Mas Citta é definido como cognição (ārammaṇacintana). Se o objeto surge e cessa, a cognição também deve.
3. <strong>Niggaha:</strong> Um Citta eterno não pode cognizar objetos transitórios sem ser ele próprio transitório.
            `;
            pedagogicalAnalogy = 'O Espelho: Um espelho reflete imagens passageiras. Se o espelho "cogniza", ele muda de estado. No Abhidhamma, cada reflexo é um novo espelho (novo Citta).';
            detailedSyllogismBreakdown = 'Se X é incondicionado (Asaṅkhata) e eterno, não pode participar de processos condicionados (Saṅkhata). Cognição é um processo. Citta não pode ser eterno.';
        }
        else if (lang === 'es') {
            paradox = '<em>"Si la Mente es eterna pero el Cuerpo impermanente, ¿cómo un observador eterno interactúa con un objeto momentáneo sin alterarse?"</em>';
            logic = `
1. <strong>Anuloma:</strong> Si el Citta (Mente) es eterno, no surge ni cesa.
2. <strong>Paṭikamma:</strong> Pero Citta se define como la cognición (ārammaṇacintana). Si el objeto surge y cesa, la cognición también debe.
3. <strong>Niggaha:</strong> Un Citta eterno no puede cognizar objetos transitorios sin ser él mismo transitorio.
            `;
            pedagogicalAnalogy = 'El Espejo: Un espejo refleja imágenes. Si el espejo "cogniza", cambia de estado. En Abhidhamma, cada reflejo es un nuevo espejo (nuevo Citta).';
            detailedSyllogismBreakdown = 'Si X es incondicionado (Asaṅkhata) y eterno, no puede participar en procesos condicionados (Saṅkhata). La cognición es un proceso. Citta no puede ser eterno.';
        }
        else {
            paradox = '<em>"If the Mind is eternal but the Body is impermanent, how can an eternal observer interact with a momentary object without itself changing?"</em>';
            logic = `
1. <strong>Anuloma:</strong> If Citta (Mind) is eternal, it does not arise or cease.
2. <strong>Paṭikamma:</strong> But Citta is defined as the cognizing of an object (ārammaṇacintana). When objects arise and cease, cognition must arise and cease.
3. <strong>Niggaha:</strong> An eternal Citta cannot cognize transient objects without being transient itself.
            `;
            pedagogicalAnalogy = 'The Mirror Analogy: A mirror reflects passing images. If the mirror itself is "cognizing", it changes state with each reflection. In Abhidhamma, each reflection is a new mirror (a new Citta).';
            detailedSyllogismBreakdown = 'If X is unconditioned (Asaṅkhata) and eternal, X cannot partake in conditioned processes (Saṅkhata). Cognition is a process. Thus, Citta cannot be eternal.';
        }
    }
    else if (scenarioId === 'amara_vikkhepa_vada') {
        verdict = 'Vikkhepo (Evasion) / Appaṭibhā (Inability to reply)';
        if (lang === 'pt') {
            paradox = '<em>"Ao recusar tomar posição, ele tenta escapar da verdade, mas num universo finito, recusar (A) e recusar (¬A) viola a Lei do Terceiro Excluído."</em>';
            logic = `
1. <strong>Anuloma:</strong> A proposição P é verdadeira? (Não digo que é assim).
2. <strong>Paṭikamma:</strong> A proposição P é falsa? (Não digo que é assado).
3. <strong>Niggaha:</strong> Na ontologia Abhidhamma, todo Dhamma ou possui uma característica (Sabhāva) ou não possui.
4. <strong>Upanaya:</strong> Recusar afirmar ou negar destrói a possibilidade de conhecimento (Ñāṇa).
            `;
            pedagogicalAnalogy = 'O Tribunal: Como uma testemunha que recusa dizer Sim ou Não por medo, a Enguia Cética não pode participar do tribunal da lógica.';
            detailedSyllogismBreakdown = 'Lógica Formal: P ∨ ¬P deve ser Verdadeiro (Terceiro Excluído). O oponente afirma ¬P ∧ ¬(¬P), uma contradição direta (Falso) sob a Lei da Não Contradição.';
        }
        else if (lang === 'es') {
            paradox = '<em>"Al negarse a tomar posición, intenta escapar de la verdad, pero en un universo finito, rechazar (A) y rechazar (¬A) viola la Ley del Tercero Excluido."</em>';
            logic = `
1. <strong>Anuloma:</strong> ¿Es la proposición P verdadera? (No digo que sea así).
2. <strong>Paṭikamma:</strong> ¿Es la proposición P falsa? (No digo que sea asado).
3. <strong>Niggaha:</strong> En la ontología Abhidhamma, todo Dhamma o posee una característica (Sabhāva) o no la posee.
4. <strong>Upanaya:</strong> Negarse a afirmar o negar destruye la posibilidad de conocimiento (Ñāṇa).
            `;
            pedagogicalAnalogy = 'El Tribunal: Como un testigo que se niega a decir Sí o No por miedo, la Anguila no puede participar en el tribunal de la lógica.';
            detailedSyllogismBreakdown = 'Lógica Formal: P ∨ ¬P debe ser Verdadero (Tercero Excluido). El oponente afirma ¬P ∧ ¬(¬P), una contradicción directa (Falso) bajo la Ley de No Contradicción.';
        }
        else {
            paradox = '<em>"By refusing to take any position, the Eel-wriggler attempts to escape truth, but in a finite universe, refusing (A) and refusing (¬A) violates the Law of Excluded Middle."</em>';
            logic = `
1. <strong>Anuloma:</strong> Is the proposition P true? (I don't say it is thus).
2. <strong>Paṭikamma:</strong> Is the proposition P false? (I don't say it is otherwise).
3. <strong>Niggaha:</strong> In the Abhidhamma ontology, every Dhamma either possesses a specific characteristic (Sabhāva) or it does not.
4. <strong>Upanaya:</strong> Refusing to affirm or deny destroys the possibility of knowledge (Ñāṇa) and dialogue.
            `;
            pedagogicalAnalogy = 'The Courtroom: Like a witness who refuses to say Yes or No to a direct question out of fear of perjury, the Amarāvikkhepika cannot participate in the court of logic.';
            detailedSyllogismBreakdown = 'Formal Logic: P ∨ ¬P must be True (Law of Excluded Middle). The opponent asserts ¬P ∧ ¬(¬P), which is a direct contradiction (False) under the Law of Non-Contradiction.';
        }
    }
    else if (scenarioId === 'adhicca_samuppanna_vada') {
        verdict = 'Paṭiññāvirodho (Contradicting the Proposition)';
        if (lang === 'pt') {
            paradox = '<em>"Se as coisas surgem sem causa, qualquer coisa poderia surgir em qualquer lugar. A ordem do universo é destruída."</em>';
            logic = `
1. <strong>Anuloma:</strong> Se o mundo surge por acaso, não há condições (paccaya) para ele.
2. <strong>Paṭikamma:</strong> Se não há condições, uma mangueira poderia brotar de semente de maçã.
3. <strong>Niggaha:</strong> Observamos estrita condicionalidade (Paṭiccasamuppāda).
4. <strong>Niggamana:</strong> Portanto, a origem sem causa é empírica e logicamente falsa.
            `;
            pedagogicalAnalogy = 'A Loteria: Até uma loteria não é "sem causa". Causelessness verdadeira significa mágica sem mágico, impossível na matriz do Paṭṭhāna.';
            detailedSyllogismBreakdown = 'Se o Efeito E ocorre sem Causa C, a probabilidade de E ocorrer é uniforme e infinita. Empiricamente, E só ocorre quando C está presente (Kāraṇaniyāma).';
        }
        else if (lang === 'es') {
            paradox = '<em>"Si las cosas surgen sin causa, cualquier cosa podría surgir en cualquier lugar. El orden del universo se destruye."</em>';
            logic = `
1. <strong>Anuloma:</strong> Si el mundo surge por azar, no hay condiciones (paccaya).
2. <strong>Paṭikamma:</strong> Si no hay condiciones, un mango podría brotar de una semilla de manzana.
3. <strong>Niggaha:</strong> Observamos estricta condicionalidad (Paṭiccasamuppāda).
4. <strong>Niggamana:</strong> Por lo tanto, el origen sin causa es empírica y lógicamente falso.
            `;
            pedagogicalAnalogy = 'La Lotería: Incluso una lotería no es "sin causa". El verdadero azar absoluto significa magia sin mago, imposible en la matriz del Paṭṭhāna.';
            detailedSyllogismBreakdown = 'Si el Efecto E ocurre sin Causa C, la probabilidad de que E ocurra es uniforme. Empíricamente, E solo ocurre cuando C está presente (Kāraṇaniyāma).';
        }
        else {
            paradox = '<em>"If things arise without a cause, then anything could arise anywhere at any time. The order of the universe is destroyed."</em>';
            logic = `
1. <strong>Anuloma:</strong> If the world arises by chance, there are no conditions (paccaya) for its arising.
2. <strong>Paṭikamma:</strong> If there are no conditions, then a mango tree could sprout from an apple seed, or from empty space.
3. <strong>Niggaha:</strong> We observe strict conditionality (Paṭiccasamuppāda).
4. <strong>Niggamana:</strong> Therefore, causeless origin is empirically and logically false.
            `;
            pedagogicalAnalogy = 'The Lottery: Even a lottery is not "causeless" (it depends on tickets, machines, physics). True causelessness means magic without a magician—an impossibility in the Abhidhamma matrix of 24 Paccayas.';
            detailedSyllogismBreakdown = 'If Effect E occurs without Cause C, then the probability of E occurring at any time t is uniform and unbounded. Empirical reality shows E only occurs when C is present (Kāraṇaniyāma).';
        }
    }
    else if (scenarioId === 'vipaka_citta') {
        verdict = 'Asambandhatthaṃ (The Incoherent)';
        if (lang === 'pt') {
            paradox = '<em>"Se um resultado (vipāka) produz um resultado, então uma ação causa infinitos resultados eternos."</em>';
            logic = `
1. <strong>Anuloma:</strong> Se Vipāka produz Vipāka, o ciclo nunca termina naturalmente.
2. <strong>Paṭikamma:</strong> Mas Vipāka é passivo (apenas experiencia), apenas Javana (kamma ativo) produz resultados.
3. <strong>Niggaha:</strong> Confunde-se o resultado passivo com a geração ativa.
            `;
            pedagogicalAnalogy = 'Analogia do Eco: Um eco (vipāka) não pode produzir outro eco por si só; ele requer um som original (kamma).';
            detailedSyllogismBreakdown = 'No Abhidhamma, as cittas Vipāka não possuem as raízes ativas (Kusala/Akusala Hetu) durante a fase Javana.';
        }
        else if (lang === 'es') {
            paradox = '<em>"Si un resultado (vipāka) produce un resultado, entonces una acción causa infinitos resultados eternos."</em>';
            logic = `
1. <strong>Anuloma:</strong> Si Vipāka produce Vipāka, el ciclo nunca termina naturalmente.
2. <strong>Paṭikamma:</strong> Pero Vipāka es pasivo (solo experimenta), solo Javana (kamma activo) produce resultados.
3. <strong>Niggaha:</strong> Se confunde el resultado pasivo con la generación activa.
            `;
            pedagogicalAnalogy = 'Analogía del Eco: Un eco (vipāka) no puede producir otro eco por sí mismo; requiere un sonido original (kamma).';
            detailedSyllogismBreakdown = 'En Abhidhamma, las cittas Vipāka carecen de las raíces activas (Kusala/Akusala Hetu) durante la fase Javana.';
        }
        else {
            paradox = '<em>"If a result (vipāka) produces a result, then one action causes infinite eternal results."</em>';
            logic = `
1. <strong>Anuloma:</strong> If Vipāka produces Vipāka, the cycle never ends naturally.
2. <strong>Paṭikamma:</strong> But Vipāka is passive (it experiences), only Javana (active kamma) produces results.
3. <strong>Niggaha:</strong> Confusing the passive result with active generation.
            `;
            pedagogicalAnalogy = 'Echo Analogy: An echo (vipāka) cannot produce another echo by itself; it requires an original sound (kamma).';
            detailedSyllogismBreakdown = 'In Abhidhamma, Vipāka cittas lack the active kammic roots (Kusala/Akusala Hetu) during the Javana phase.';
        }
    }
    return { verdict, history, metaLogic, paradox, logic, pedagogicalAnalogy, detailedSyllogismBreakdown };
}
//# sourceMappingURL=kathavatthu_logic.js.map