import { AbhidhammaLogicEngine } from './sampayoganaya.js';
import { AllCittas } from './citta.js';

export type DebateState = 
    | 'IDLE'
    | 'PROPOSING_THESIS'
    | 'QUESTIONING'
    | 'DEFENDING'
    | 'CONCLUDED_VICTORY'
    | 'CONCLUDED_DEFEAT';

/**
 * The 22 Niggahaṭṭhānāni (Grounds for Defeat in Debate)
 * Based on the Kathāvatthu and standard Theravada logic.
 */
export enum Niggahatthana {
    NONE = 0,
    PATINNAYAHANI = 1,              // Abandoning the proposition (admitting a property in a dissimilar example)
    PATINNAYANTARAM = 2,            // Shifting the proposition (stating another meaning when refuted)
    PATINNAYAVIRODHO = 3,           // Contradicting the proposition (stating a reason that contradicts the prop)
    PATINNAYASANNYASO = 4,          // Renouncing the proposition (withdrawing proposed meaning)
    HETVANTARAM = 5,                // Shifting the reason (stating a qualified reason after unqualified is refuted)
    ATTHANTARAM = 6,                // Shifting the topic (stating a meaning not useful for the matter)
    NIRATTHAKAM = 7,                // The meaningless (devoid of meaning, like reciting a table of contents)
    AVINNATATTHAM = 8,              // The unintelligible (not understood by witnesses even after 3 times)
    ASAMBANDHATTHAM = 9,            // The incoherent (no connection between preceding and succeeding parts)
    APPATTAKALAM = 10,              // The inopportune (wrong order)
    UNAM = 11,                      // The deficient (missing a part)
    ADHIKAM = 12,                   // The superfluous (more than one reason or example)
    PUNARUTTAM = 13,                // Repetition (repeated statement of words and meanings)
    ANANUBHASANAM = 14,             // Failure to restate (not restating what was said 3 times)
    AVINNATAM = 15,                 // Incomprehension (understood by assembly but not by opponent)
    APPATIBHA = 16,                 // Inability to reply (opponent fails to reply to valid statement)
    VIKKHEPO = 17,                  // Evasion (interrupting discussion on pretext of other business)
    MATANUÑÑĀ = 18,                 // Admission of a counter-argument (attributing fault by admitting one's own)
    ANUYUNJITABBASSA_UPEKKHANAM = 19, // Overlooking the censurable (not censuring what is worthy)
    ANANUYUNJITABBASSA_ANUYOGO = 20,  // Censuring the non-censurable
    APASIDDHANTARAM = 21,           // Deviation from doctrine (resorting to another doctrine without principle)
    HETVABHASA = 22                 // Fallacious reasons (unproven, inconclusive, contradictory)
}

/**
 * Meta-Logical Principles of the Theravāda (Kathāvatthu / Anuṭīkā Epistemology)
 */
export enum MetaLogicPrinciple {
    HETVABHASA = "Hetvābhāsā (Fallacious Reason)", // The reason provided is unestablished, inconclusive, or contradictory.
    EXCLUDED_MIDDLE = "Law of Excluded Middle (A or ¬A)", // Rejection of Catuṣkoṭi for Paramattha. Forces binary choice.
    DOUBLE_NEGATION = "Law of Double Negation (Anuloma/Paṭiloma)", // "A is not non-B" equates to "A is B". Used to force Paṭiññāvirodho.
    THAPANIYA_PANHA = "Ṭhapanīyapañha (Unanswerable Question)" // A question built on a non-existent or flawed premise (Avyākata).
}

export interface DebateClaim {
    subject: string;
    predicate: string;
    isUltimate: boolean;
}

/**
 * A strict state machine for conducting debates following the Kathāvatthu methodology.
 * Logic is 100% deterministic and mathematically evaluates claims against the Abhidhamma ontology.
 */
export class DebateStateMachine {
    private currentState: DebateState = 'IDLE';
    
    private history: DebateClaim[] = [];

    constructor() {}

    public getState(): DebateState {
        return this.currentState;
    }

    public getHistory(): DebateClaim[] {
        return [...this.history];
    }

    /**
     * Start the debate by proposing a thesis.
     * Evaluates the thesis deterministically against the ontology.
     */
    public proposeThesis(claim: DebateClaim): { state: DebateState, defeat: Niggahatthana } {
        if (this.currentState !== 'IDLE') {
            throw new Error("Can only propose thesis from IDLE state.");
        }
        
        
        this.history.push(claim);

        // Deterministic ontology check
        const isParamattha = AbhidhammaLogicEngine.isUltimateReality(claim.subject);

        // If the claim asserts it's an ultimate truth but it's not found in the Cetasika/Citta ontology
        if (claim.isUltimate && !isParamattha) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.PATINNAYAVIRODHO };
        }

        // Logic check: Asserting a conventional truth (e.g. 'Puggala') as an entity with ultimate predicates
        const conventionalTruths = ['puggala', 'satta', 'jiva', 'atman'];
        if (conventionalTruths.includes(claim.subject.toLowerCase()) && claim.isUltimate) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.PATINNAYAVIRODHO };
        }

        this.currentState = 'QUESTIONING';
        return { state: this.currentState, defeat: Niggahatthana.NONE };
    }

    /**
     * Evaluate the opponent's response deterministically.
     */
    public evaluateResponse(
        responseMatchesPrevious: boolean, 
        isSilent: boolean, 
        isEvasive: boolean,
        establishesReason: boolean
    ): { state: DebateState, defeat: Niggahatthana } {
        
        if (this.currentState !== 'QUESTIONING' && this.currentState !== 'DEFENDING') {
            throw new Error("Cannot evaluate response in current state.");
        }

        if (isSilent) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.APPATIBHA }; // Inability to reply
        }

        if (isEvasive) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.VIKKHEPO }; // Evasion
        }

        if (!responseMatchesPrevious) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.PATINNAYAHANI }; // Abandoning the proposition
        }

        if (!establishesReason) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.HETVABHASA }; // Fallacious reason
        }

        this.currentState = 'CONCLUDED_VICTORY';
        return { state: this.currentState, defeat: Niggahatthana.NONE };
    }

    /**
     * Asserts if a certain mental factor (Cetasika) can arise in a specific consciousness (Citta).
     * Deterministically verified using the Sampayoganaya.
     */
    public assertAssociation(cittaId: string, cetasikaPaliName: string): { valid: boolean, defeat: Niggahatthana } {
        const citta = AllCittas[cittaId];
        if (!citta) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { valid: false, defeat: Niggahatthana.ASAMBANDHATTHAM }; // Incoherent
        }

        try {
            const associated = AbhidhammaLogicEngine.getAssociatedCetasikas(citta);
            const isAssociated = associated.some(c => c.paliName.toLowerCase() === cetasikaPaliName.toLowerCase());

            if (!isAssociated) {
                this.currentState = 'CONCLUDED_DEFEAT';
                return { valid: false, defeat: Niggahatthana.ASAMBANDHATTHAM };
            }

            return { valid: true, defeat: Niggahatthana.NONE };
        } catch (error) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { valid: false, defeat: Niggahatthana.ASAMBANDHATTHAM };
        }
    }
}
export * from './formal_logic.js';
