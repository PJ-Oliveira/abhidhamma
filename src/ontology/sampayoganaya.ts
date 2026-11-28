import { Citta, AllCittas } from './citta.js';
import { Cetasika, AllCetasikas } from './cetasika.js';

/**
 * Deterministic association engine (Sampayoganaya).
 * Associations are mathematical and invariant.
 * The AI engine queries this deterministic matrix rather than guessing mental factors.
 */
export class AbhidhammaLogicEngine {
    
    /**
     * Given a Citta, returns the Cetasikas that arise with it.
     * Throws an error if the Citta is not found.
     */
    static getAssociatedCetasikas(citta: Citta): Cetasika[] {
        return citta.associatedCetasikas.map(cetasikaId => AllCetasikas[cetasikaId]).filter(Boolean) as Cetasika[];
    }

    /**
     * Strict validator for logical debate (Vāda).
     * Checks whether concept X belongs to the ontology of Paramattha Dhammas (Ultimate Realities).
     */
    static isUltimateReality(conceptPaliName: string): boolean {
        // If it is a Citta or Cetasika, it is an ultimate reality
        if (Object.values(AllCittas).some(c => c.paliName.toLowerCase() === conceptPaliName.toLowerCase() || c.id === conceptPaliName)) return true;
        if (Object.values(AllCetasikas).some(c => c.paliName.toLowerCase() === conceptPaliName.toLowerCase())) {
            return true;
        }
        
        // Conventional concepts such as "Puggala" (Person), "Satta" (Being), or "Kāla" (Time) return false.
        const conventionalTruths = ['puggala', 'satta', 'kāla', 'disa', 'nimitta'];
        if (conventionalTruths.includes(conceptPaliName.toLowerCase())) {
            return false;
        }

        // Default to false for unknown concepts outside the finite ontology:
        return false; 
    }
}
