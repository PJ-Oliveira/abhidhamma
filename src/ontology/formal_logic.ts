import { AllCittas } from './citta.js';
import { AllCetasikas } from './cetasika.js';

export type Term = string; // e.g. "citta_ak_lobha_1", "Phassa", or "Puggala"

export enum Operator {
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT',
    IMPLIES = 'IMPLIES',
    EQUIVALENT = 'EQUIVALENT'
}

/**
 * A Proposition is an abstract logical statement that can be evaluated to True or False
 * against the absolute finite universe of Abhidhamma (Paramattha Dhammas).
 */
export class Proposition {
    // For atomic propositions, evaluates to true/false based on a specific predicate.
    // In Abhidhamma, typical predicates: IsUltimate(x), IsAssociatedWith(x, y)
    
    constructor(
        public readonly type: 'ATOMIC' | 'COMPOUND',
        public readonly evaluateFn?: () => boolean,
        public readonly operator?: Operator,
        public readonly left?: Proposition,
        public readonly right?: Proposition
    ) {}

    /**
     * Recursive evaluation of the proposition ensuring finite, strict Boolean logic.
     */
    public evaluate(): boolean {
        if (this.type === 'ATOMIC') {
            if (!this.evaluateFn) throw new Error("Atomic proposition must have an evaluate function.");
            return this.evaluateFn();
        }

        if (this.type === 'COMPOUND') {
            switch (this.operator) {
                case Operator.NOT:
                    if (!this.left) throw new Error("NOT operator requires left operand.");
                    // Double negation is intrinsically supported by JavaScript boolean logic (!(!P))
                    return !this.left.evaluate();
                case Operator.AND:
                    if (!this.left || !this.right) throw new Error("AND operator requires two operands.");
                    // Law of Non-Contradiction (P AND NOT P) will inherently evaluate to false here.
                    return this.left.evaluate() && this.right.evaluate();
                case Operator.OR:
                    if (!this.left || !this.right) throw new Error("OR operator requires two operands.");
                    // Law of Excluded Middle (P OR NOT P) will inherently evaluate to true here.
                    return this.left.evaluate() || this.right.evaluate();
                case Operator.IMPLIES:
                    if (!this.left || !this.right) throw new Error("IMPLIES operator requires two operands.");
                    return !this.left.evaluate() || this.right.evaluate();
                case Operator.EQUIVALENT:
                    if (!this.left || !this.right) throw new Error("EQUIVALENT operator requires two operands.");
                    return this.left.evaluate() === this.right.evaluate();
                default:
                    throw new Error("Unknown operator.");
            }
        }
        return false;
    }
}

/**
 * The Finitist Universe Engine (Motor Lógico Finitista e Completo)
 * It contains the finite set of ALL Paramattha Dhammas.
 * Any question outside this set is either a conventional truth (Sammuti) or a fallacy.
 */
export class FinitistUniverse {
    /**
     * Complete finite set of Ultimate Realities mapped in the current system.
     */
    public static getAllUltimateRealities(): string[] {
        const cittaIds = Object.values(AllCittas).map(c => c.id);
        const cetasikaIds = Object.values(AllCetasikas).map(c => c.paliName); // Or ID, using paliName as it is common in queries
        return [...cittaIds, ...cetasikaIds];
    }

    /**
     * Creates an Atomic Proposition asserting whether a term belongs to the finite universe.
     */
    public static IsUltimateReality(term: Term): Proposition {
        return new Proposition('ATOMIC', () => {
            const termLower = term.toLowerCase();
            return Object.values(AllCittas).some(c => c.paliName.toLowerCase() === termLower || c.id.toLowerCase() === termLower) ||
                   Object.values(AllCetasikas).some(c => c.paliName.toLowerCase() === termLower);
        });
    }

    /**
     * Proves the Law of Non-Contradiction: ¬(P ∧ ¬P) is always TRUE.
     */
    public static proveLawOfNonContradiction(p: Proposition): boolean {
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, p);
        const pAndNotP = new Proposition('COMPOUND', undefined, Operator.AND, p, notP);
        const notPAndNotP = new Proposition('COMPOUND', undefined, Operator.NOT, pAndNotP);
        return notPAndNotP.evaluate();
    }

    /**
     * Proves the Law of Excluded Middle: (P ∨ ¬P) is always TRUE.
     */
    public static proveLawOfExcludedMiddle(p: Proposition): boolean {
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, p);
        const pOrNotP = new Proposition('COMPOUND', undefined, Operator.OR, p, notP);
        return pOrNotP.evaluate();
    }

    /**
     * Proves Double Negation: ¬¬P ↔ P is always TRUE.
     */
    public static proveDoubleNegation(p: Proposition): boolean {
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, p);
        const notNotP = new Proposition('COMPOUND', undefined, Operator.NOT, notP);
        const equivalent = new Proposition('COMPOUND', undefined, Operator.EQUIVALENT, notNotP, p);
        return equivalent.evaluate();
    }
}
