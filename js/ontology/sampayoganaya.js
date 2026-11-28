import { AllCittas } from './citta.js?v=ed8676ed';
import { AllCetasikas } from './cetasika.js?v=ed8676ed';
export class AbhidhammaLogicEngine {
    static getAssociatedCetasikas(citta) {
        return citta.associatedCetasikas.map(cetasikaId => AllCetasikas[cetasikaId]).filter(Boolean);
    }
    static isUltimateReality(conceptPaliName) {
        if (Object.values(AllCittas).some(c => c.paliName.toLowerCase() === conceptPaliName.toLowerCase() || c.id === conceptPaliName))
            return true;
        if (Object.values(AllCetasikas).some(c => c.paliName.toLowerCase() === conceptPaliName.toLowerCase())) {
            return true;
        }
        const conventionalTruths = ['puggala', 'satta', 'kāla', 'disa', 'nimitta'];
        if (conventionalTruths.includes(conceptPaliName.toLowerCase())) {
            return false;
        }
        return false;
    }
}
//# sourceMappingURL=sampayoganaya.js.map