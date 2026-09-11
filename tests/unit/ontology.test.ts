import { describe, it, expect } from 'vitest';
import { AllCittas } from '../../src/ontology/citta.js';
import { AllCetasikas } from '../../src/ontology/cetasika.js';
import { AbhidhammaLogicEngine } from '../../src/ontology/sampayoganaya.js';
import { DebateStateMachine, Niggahatthana } from '../../src/ontology/kathavatthu.js';
import { evaluateScenario, evaluateCustomClaim } from '../../src/ontology/kathavatthu_logic.js';
import { getCommentaryExplanation } from '../../src/ontology/commentary.js';

describe('Ontology Engine', () => {
    it('should validate core dictionaries', () => {
        expect(Object.keys(AllCittas).length).toBeGreaterThan(0);
        expect(Object.keys(AllCetasikas).length).toBeGreaterThan(0);
    });

    it('should test Sampayoganaya logic', () => {
        const cetasikas = AbhidhammaLogicEngine.getAssociatedCetasikas({ id: 'test_citta', paliName: 'Test', englishTranslation: 'Test', jati: 'Kusala', bhumi: 'Kāmāvacara', description: 'Test', associatedCetasikas: ['Phassa'] } as any);
        expect(cetasikas.length).toBe(1);

        expect(AbhidhammaLogicEngine.isUltimateReality('citta_ak_lobha_1')).toBe(true);
        expect(AbhidhammaLogicEngine.isUltimateReality('Puggala')).toBe(false);
    });

    it('should test Kathavatthu Logic', () => {
        // Test custom claims
        const selfClaim = evaluateCustomClaim('The self is real');
        expect(selfClaim.verdict).toContain('Paṭiññāvirodho');

        const timeClaim = evaluateCustomClaim('Time exists');
        expect(timeClaim.verdict).toContain('Paṭiññāvirodho');

        const cittaClaim = evaluateCustomClaim('Citta transmigrates');
        expect(cittaClaim.verdict).toContain('Apasiddhantaraṃ');

        const sabhavaClaim = evaluateCustomClaim('Sabhava specific general');
        expect(sabhavaClaim.verdict).toContain('Paṭiññāntaraṃ');

        const causeClaim = evaluateCustomClaim('permanent cause simultaneous arise');
        expect(causeClaim.verdict).toContain('Asambandhatthaṃ');

        const unknownClaim = evaluateCustomClaim('unknown stuff');
        expect(unknownClaim.verdict).toContain('Aviññātatthaṃ');

        // Test scenarios
        const scenario = evaluateScenario('puggala_vada');
        expect(scenario.verdict).toContain('Paṭiññāvirodho');
        
        const fallback = evaluateScenario('unknown_scenario');
        expect(fallback.verdict).toContain('Aviññātatthaṃ');
    });

    it('should test Commentary Context', () => {
        const ctx = getCommentaryExplanation('puggala', Niggahatthana.PATINNAYAVIRODHO);
        expect(ctx).toContain('A escola Puggalavāda');
        
        const nullCtx = getCommentaryExplanation('puggala', Niggahatthana.HETVABHASA);
        expect(nullCtx).toContain('Puggalavāda');
    });

    it('should test DebateStateMachine', () => {
        const sm = new DebateStateMachine();
        expect(sm.getState()).toBe('IDLE');
        
        // Puggala
        let res = sm.proposeThesis({ subject: 'Puggala', predicate: 'exists', isUltimate: true });
        expect(res.state).toBe('CONCLUDED_DEFEAT');
        expect(res.defeat).toBe(Niggahatthana.PATINNAYAVIRODHO);
        
        // Restart via new instance
        const sm2 = new DebateStateMachine();
        res = sm2.proposeThesis({ subject: 'Phassa', predicate: 'is kusala', isUltimate: true });
        expect(res.state).toBe('QUESTIONING');
        
        res = sm2.evaluateResponse(true, false, false, true);
        expect(res.state).toBe('CONCLUDED_VICTORY');
        
        const sm3 = new DebateStateMachine();
        sm3.proposeThesis({ subject: 'Phassa', predicate: 'is kusala', isUltimate: true });
        res = sm3.evaluateResponse(false, false, false, false); // doesn't match
        expect(res.defeat).toBe(Niggahatthana.PATINNAYAHANI);
        
        const sm4 = new DebateStateMachine();
        sm4.proposeThesis({ subject: 'Phassa', predicate: 'is kusala', isUltimate: true });
        res = sm4.evaluateResponse(true, true, false, false); // silent
        expect(res.defeat).toBe(Niggahatthana.APPATIBHA);
        
        const sm5 = new DebateStateMachine();
        sm5.proposeThesis({ subject: 'Phassa', predicate: 'is kusala', isUltimate: true });
        res = sm5.evaluateResponse(true, false, true, false); // evasive
        expect(res.defeat).toBe(Niggahatthana.VIKKHEPO);
        
        const sm6 = new DebateStateMachine();
        sm6.proposeThesis({ subject: 'Phassa', predicate: 'is kusala', isUltimate: true });
        res = sm6.evaluateResponse(true, false, false, false); // no reason
        expect(res.defeat).toBe(Niggahatthana.HETVABHASA);
        
        // assertAssociation
        const sm7 = new DebateStateMachine();
        res = sm7.assertAssociation('nonexistent', 'Phassa');
        expect(res.defeat).toBe(Niggahatthana.ASAMBANDHATTHAM);
        
        res = sm7.assertAssociation('LobhaMula1', 'Phassa');
        expect(res.valid).toBe(true);
        
        res = sm7.assertAssociation('LobhaMula1', 'Dosa'); // Dosa not in lobhamula
        expect(res.valid).toBe(false);
    });
});
