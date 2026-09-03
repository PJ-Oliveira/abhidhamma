import { AbhidhammaLogicEngine } from './sampayoganaya.js';
import { AllCittas } from './citta.js';
export var Niggahatthana;
(function (Niggahatthana) {
    Niggahatthana[Niggahatthana["NONE"] = 0] = "NONE";
    Niggahatthana[Niggahatthana["PATINNAYAHANI"] = 1] = "PATINNAYAHANI";
    Niggahatthana[Niggahatthana["PATINNAYANTARAM"] = 2] = "PATINNAYANTARAM";
    Niggahatthana[Niggahatthana["PATINNAYAVIRODHO"] = 3] = "PATINNAYAVIRODHO";
    Niggahatthana[Niggahatthana["PATINNAYASANNYASO"] = 4] = "PATINNAYASANNYASO";
    Niggahatthana[Niggahatthana["HETVANTARAM"] = 5] = "HETVANTARAM";
    Niggahatthana[Niggahatthana["ATTHANTARAM"] = 6] = "ATTHANTARAM";
    Niggahatthana[Niggahatthana["NIRATTHAKAM"] = 7] = "NIRATTHAKAM";
    Niggahatthana[Niggahatthana["AVINNATATTHAM"] = 8] = "AVINNATATTHAM";
    Niggahatthana[Niggahatthana["ASAMBANDHATTHAM"] = 9] = "ASAMBANDHATTHAM";
    Niggahatthana[Niggahatthana["APPATTAKALAM"] = 10] = "APPATTAKALAM";
    Niggahatthana[Niggahatthana["UNAM"] = 11] = "UNAM";
    Niggahatthana[Niggahatthana["ADHIKAM"] = 12] = "ADHIKAM";
    Niggahatthana[Niggahatthana["PUNARUTTAM"] = 13] = "PUNARUTTAM";
    Niggahatthana[Niggahatthana["ANANUBHASANAM"] = 14] = "ANANUBHASANAM";
    Niggahatthana[Niggahatthana["AVINNATAM"] = 15] = "AVINNATAM";
    Niggahatthana[Niggahatthana["APPATIBHA"] = 16] = "APPATIBHA";
    Niggahatthana[Niggahatthana["VIKKHEPO"] = 17] = "VIKKHEPO";
    Niggahatthana[Niggahatthana["MATANU\u00D1\u00D1\u0100"] = 18] = "MATANU\u00D1\u00D1\u0100";
    Niggahatthana[Niggahatthana["ANUYUNJITABBASSA_UPEKKHANAM"] = 19] = "ANUYUNJITABBASSA_UPEKKHANAM";
    Niggahatthana[Niggahatthana["ANANUYUNJITABBASSA_ANUYOGO"] = 20] = "ANANUYUNJITABBASSA_ANUYOGO";
    Niggahatthana[Niggahatthana["APASIDDHANTARAM"] = 21] = "APASIDDHANTARAM";
    Niggahatthana[Niggahatthana["HETVABHASA"] = 22] = "HETVABHASA";
})(Niggahatthana || (Niggahatthana = {}));
export var MetaLogicPrinciple;
(function (MetaLogicPrinciple) {
    MetaLogicPrinciple["HETVABHASA"] = "Hetv\u0101bh\u0101s\u0101 (Fallacious Reason)";
    MetaLogicPrinciple["EXCLUDED_MIDDLE"] = "Law of Excluded Middle (A or \u00ACA)";
    MetaLogicPrinciple["DOUBLE_NEGATION"] = "Law of Double Negation (Anuloma/Pa\u1E6Diloma)";
    MetaLogicPrinciple["THAPANIYA_PANHA"] = "\u1E6Chapan\u012Byapa\u00F1ha (Unanswerable Question)";
})(MetaLogicPrinciple || (MetaLogicPrinciple = {}));
export class DebateStateMachine {
    currentState = 'IDLE';
    history = [];
    constructor() { }
    getState() {
        return this.currentState;
    }
    getHistory() {
        return [...this.history];
    }
    proposeThesis(claim) {
        if (this.currentState !== 'IDLE') {
            throw new Error("Can only propose thesis from IDLE state.");
        }
        this.history.push(claim);
        const isParamattha = AbhidhammaLogicEngine.isUltimateReality(claim.subject);
        if (claim.isUltimate && !isParamattha) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.PATINNAYAVIRODHO };
        }
        const conventionalTruths = ['puggala', 'satta', 'jiva', 'atman'];
        if (conventionalTruths.includes(claim.subject.toLowerCase()) && claim.isUltimate) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.PATINNAYAVIRODHO };
        }
        this.currentState = 'QUESTIONING';
        return { state: this.currentState, defeat: Niggahatthana.NONE };
    }
    evaluateResponse(responseMatchesPrevious, isSilent, isEvasive, establishesReason) {
        if (this.currentState !== 'QUESTIONING' && this.currentState !== 'DEFENDING') {
            throw new Error("Cannot evaluate response in current state.");
        }
        if (isSilent) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.APPATIBHA };
        }
        if (isEvasive) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.VIKKHEPO };
        }
        if (!responseMatchesPrevious) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.PATINNAYAHANI };
        }
        if (!establishesReason) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { state: this.currentState, defeat: Niggahatthana.HETVABHASA };
        }
        this.currentState = 'CONCLUDED_VICTORY';
        return { state: this.currentState, defeat: Niggahatthana.NONE };
    }
    assertAssociation(cittaId, cetasikaPaliName) {
        const citta = AllCittas[cittaId];
        if (!citta) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { valid: false, defeat: Niggahatthana.ASAMBANDHATTHAM };
        }
        try {
            const associated = AbhidhammaLogicEngine.getAssociatedCetasikas(citta);
            const isAssociated = associated.some(c => c.paliName.toLowerCase() === cetasikaPaliName.toLowerCase());
            if (!isAssociated) {
                this.currentState = 'CONCLUDED_DEFEAT';
                return { valid: false, defeat: Niggahatthana.ASAMBANDHATTHAM };
            }
            return { valid: true, defeat: Niggahatthana.NONE };
        }
        catch (error) {
            this.currentState = 'CONCLUDED_DEFEAT';
            return { valid: false, defeat: Niggahatthana.ASAMBANDHATTHAM };
        }
    }
}
export * from './formal_logic.js';
//# sourceMappingURL=kathavatthu.js.map