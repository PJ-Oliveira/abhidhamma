import { describe, it, expect } from 'vitest';
import { Proposition, Operator, FinitistUniverse } from '../../src/ontology/formal_logic.js';

describe('Formal Logic Engine (Kathāvatthu Strict)', () => {
    
    it('should validate Law of Non-Contradiction for any proposition', () => {
        const p1 = FinitistUniverse.IsUltimateReality('Phassa');
        const p2 = FinitistUniverse.IsUltimateReality('Puggala');
        
        expect(FinitistUniverse.proveLawOfNonContradiction(p1)).toBe(true);
        expect(FinitistUniverse.proveLawOfNonContradiction(p2)).toBe(true);
    });

    it('should validate Law of Excluded Middle for any proposition', () => {
        const p1 = FinitistUniverse.IsUltimateReality('Phassa');
        const p2 = FinitistUniverse.IsUltimateReality('Puggala');
        
        expect(FinitistUniverse.proveLawOfExcludedMiddle(p1)).toBe(true);
        expect(FinitistUniverse.proveLawOfExcludedMiddle(p2)).toBe(true);
    });

    it('should validate Double Negation for any proposition', () => {
        const p1 = FinitistUniverse.IsUltimateReality('Phassa');
        const p2 = FinitistUniverse.IsUltimateReality('Puggala');
        
        expect(FinitistUniverse.proveDoubleNegation(p1)).toBe(true);
        expect(FinitistUniverse.proveDoubleNegation(p2)).toBe(true);
    });

    it('should evaluate atomic propositions correctly in the finite universe', () => {
        const p_phassa = FinitistUniverse.IsUltimateReality('Phassa');
        const p_puggala = FinitistUniverse.IsUltimateReality('Puggala');
        
        expect(p_phassa.evaluate()).toBe(true); // Phassa is real
        expect(p_puggala.evaluate()).toBe(false); // Puggala is conventional
    });
    
    it('should evaluate complex Kathavatthu-style syllogisms (Modus Ponens / Tollens)', () => {
        // If Puggala is an Ultimate Reality (P), then it must have an arising and ceasing like the 5 aggregates (Q).
        // It does not have an arising and ceasing like the 5 aggregates (NOT Q).
        // Therefore, it is not an Ultimate Reality (NOT P).
        
        let Q_evaluated = false; // Mocking the observation that it doesn't arise like aggregates
        
        const P = FinitistUniverse.IsUltimateReality('Puggala');
        const Q = new Proposition('ATOMIC', () => Q_evaluated);
        
        const implies = new Proposition('COMPOUND', undefined, Operator.IMPLIES, P, Q);
        const notQ = new Proposition('COMPOUND', undefined, Operator.NOT, Q);
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, P);
        
        // Modus Tollens: ((P => Q) AND NOT Q) => NOT P
        const p_implies_q_and_not_q = new Proposition('COMPOUND', undefined, Operator.AND, implies, notQ);
        const modusTollens = new Proposition('COMPOUND', undefined, Operator.IMPLIES, p_implies_q_and_not_q, notP);
        
        expect(modusTollens.evaluate()).toBe(true); // The logical structure is valid.
    });

    it('should prove Finitism (completeness of the universe)', () => {
        const universe = FinitistUniverse.getAllUltimateRealities();
        expect(universe.length).toBeGreaterThan(0);
        
        // Ensure some known elements are present in the finite set
        expect(universe).toContain('citta_ak_lobha_1');
        expect(universe).toContain('Phassa');
        expect(universe).not.toContain('Puggala');
    });
});
