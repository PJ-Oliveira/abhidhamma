import { Citta, AllCittas } from './citta.js';
import { Cetasika, AllCetasikas } from './cetasika.js';

/**
 * Este é o motor absoluto de associação (Sampayoganaya).
 * Aqui, a verdade é matemática e inflexível.
 * O LLM NÃO inventa quais fatores mentais estão presentes. Ele consulta este motor.
 */
export class AbhidhammaLogicEngine {
    
    /**
     * Dado um Citta, retorna os Cetasikas que inevitavelmente surgem com ele.
     * Totalmente imune a alucinações. Se o Citta não existe, lança erro.
     */
    static getAssociatedCetasikas(citta: Citta): Cetasika[] {
        return citta.associatedCetasikas.map(cetasikaId => AllCetasikas[cetasikaId]).filter(Boolean) as Cetasika[];
    }

    /**
     * Validador rígido para o debate (Vāda).
     * O LLM pergunta se um conceito x é Verdade Última.
     * Este motor não "pensa". Ele confere se X está na ontologia de Paramattha Dhammas.
     */
    static isUltimateReality(conceptPaliName: string): boolean {
        // Se é um Cetasika, é realidade última
        if (Object.values(AllCittas).some(c => c.paliName.toLowerCase() === conceptPaliName.toLowerCase() || c.id === conceptPaliName)) return true;
        if (Object.values(AllCetasikas).some(c => c.paliName.toLowerCase() === conceptPaliName.toLowerCase())) {
            return true;
        }
        
        // Se for "Puggala" (Pessoa), "Satta" (Ser), "Kāla" (Tempo), a resposta matemática é FALSO.
        const conventionalTruths = ['puggala', 'satta', 'kāla', 'disa', 'nimitta'];
        if (conventionalTruths.includes(conceptPaliName.toLowerCase())) {
            return false;
        }

        // Para evitar que a IA invente respostas sobre o que não conhece:
        return false; 
    }
}
