import { describe, it, expect } from 'vitest';
import { evaluateCustomClaim, evaluateScenario, LogicalConnective, KathavatthuRule } from '../../src/ontology/kathavatthu_logic';

describe('Kathavatthu Logic Engine', () => {

    it('should evaluate Self/Person claims', () => {
        const res = evaluateCustomClaim('does the self exist?');
        expect(res.verdict).toContain('Paṭiññāvirodho');
        expect(res.logic).toContain('Rūpa, Vedanā, Saññā, Saṅkhārā, or Viññāṇa');
    });

    it('should evaluate Time/Past claims', () => {
        const res = evaluateCustomClaim('does the past time exist?');
        expect(res.history).toContain('Time as an absolute entity');
    });

    it('should evaluate Citta/Mind claims', () => {
        const res = evaluateCustomClaim('can two cittas arise at the same time?');
        expect(res.verdict).toBeDefined();
    });

    it('should evaluate Arhat claims', () => {
        const res = evaluateCustomClaim('can an arhat fall away?');
        expect(res.verdict).toBeDefined();
    });

    it('should evaluate Nibbana claims', () => {
        const res = evaluateCustomClaim('is nibbana a place?');
        expect(res.verdict).toBeDefined();
    });

    it('should evaluate Karma claims', () => {
        const res = evaluateCustomClaim('is karma predetermined?');
        expect(res.verdict).toBeDefined();
    });

    it('should evaluate Sound claims', () => {
        const res = evaluateCustomClaim('is sound a visible object?');
        expect(res.verdict).toBeDefined();
    });

    it('should return default fallback for unknown claims', () => {
        const res = evaluateCustomClaim('something completely random');
        expect(res.verdict).toContain('Aviññātatthaṃ');
    });

    it('should evaluate known scenarios', () => {
        const res1 = evaluateScenario('puggala_katha', 'en');
        expect(res1.verdict).toBeDefined();

        const res2 = evaluateScenario('parihani_katha', 'en');
        expect(res2.verdict).toBeDefined();
    });

    it('should handle missing or invalid scenarios', () => {
        const res = evaluateScenario('nonexistent_scenario');
        expect(res.verdict).toContain('Aviññātatthaṃ');
    });

    it('localizes all canonical debate scenarios cleanly in PT and ES with zero English leaks, mistranslations, or Sanskritisms', () => {
        const ids = ['puggala_vada', 'kāla_vada', 'sassata_vada', 'ekacca_sassata_vada', 'amara_vikkhepa_vada', 'adhicca_samuppanna_vada'];
        for (const id of ids) {
            const pt = evaluateScenario(id, 'pt');
            const es = evaluateScenario(id, 'es');
            const ptAll = JSON.stringify(pt);
            const esAll = JSON.stringify(es);

            // Verdicts must be localized (never English parentheticals)
            expect(pt.verdict).not.toContain('Contradicting the Proposition');
            expect(pt.verdict).not.toContain('Deviation from Doctrine');
            expect(pt.verdict).not.toContain('Evasion');
            expect(es.verdict).not.toContain('Contradicting the Proposition');
            expect(es.verdict).not.toContain('Deviation from Doctrine');
            expect(es.verdict).not.toContain('Evasion');

            // No English leaks, typos, or mistranslations
            expect(ptAll).not.toMatch(/Inrrespondível|jhānic|Causelessness|Catuṣkoṭi|\bassado\b|Chariot Analogy|Shadow Analogy/);
            expect(esAll).not.toMatch(/jhānic|Catuṣkoṭi|\bsea asado\b|Chariot Analogy|Shadow Analogy/);

            // Pedagogical analogy & breakdown must be localized and non-empty
            expect(pt.pedagogicalAnalogy.length).toBeGreaterThan(20);
            expect(es.pedagogicalAnalogy.length).toBeGreaterThan(20);
        }
    });
});
