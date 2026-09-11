import { AllCittas } from './citta.js';
import { AllCetasikas } from './cetasika.js';
export var Operator;
(function (Operator) {
    Operator["AND"] = "AND";
    Operator["OR"] = "OR";
    Operator["NOT"] = "NOT";
    Operator["IMPLIES"] = "IMPLIES";
    Operator["EQUIVALENT"] = "EQUIVALENT";
})(Operator || (Operator = {}));
export class Proposition {
    type;
    evaluateFn;
    operator;
    left;
    right;
    constructor(type, evaluateFn, operator, left, right) {
        this.type = type;
        this.evaluateFn = evaluateFn;
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    evaluate() {
        if (this.type === 'ATOMIC') {
            if (!this.evaluateFn)
                throw new Error("Atomic proposition must have an evaluate function.");
            return this.evaluateFn();
        }
        if (this.type === 'COMPOUND') {
            switch (this.operator) {
                case Operator.NOT:
                    if (!this.left)
                        throw new Error("NOT operator requires left operand.");
                    return !this.left.evaluate();
                case Operator.AND:
                    if (!this.left || !this.right)
                        throw new Error("AND operator requires two operands.");
                    return this.left.evaluate() && this.right.evaluate();
                case Operator.OR:
                    if (!this.left || !this.right)
                        throw new Error("OR operator requires two operands.");
                    return this.left.evaluate() || this.right.evaluate();
                case Operator.IMPLIES:
                    if (!this.left || !this.right)
                        throw new Error("IMPLIES operator requires two operands.");
                    return !this.left.evaluate() || this.right.evaluate();
                case Operator.EQUIVALENT:
                    if (!this.left || !this.right)
                        throw new Error("EQUIVALENT operator requires two operands.");
                    return this.left.evaluate() === this.right.evaluate();
                default:
                    throw new Error("Unknown operator.");
            }
        }
        return false;
    }
}
export class FinitistUniverse {
    static getAllUltimateRealities() {
        const cittaIds = Object.values(AllCittas).map(c => c.id);
        const cetasikaIds = Object.values(AllCetasikas).map(c => c.paliName);
        return [...cittaIds, ...cetasikaIds];
    }
    static IsUltimateReality(term) {
        return new Proposition('ATOMIC', () => {
            const termLower = term.toLowerCase();
            return Object.values(AllCittas).some(c => c.paliName.toLowerCase() === termLower || c.id.toLowerCase() === termLower) ||
                Object.values(AllCetasikas).some(c => c.paliName.toLowerCase() === termLower);
        });
    }
    static proveLawOfNonContradiction(p) {
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, p);
        const pAndNotP = new Proposition('COMPOUND', undefined, Operator.AND, p, notP);
        const notPAndNotP = new Proposition('COMPOUND', undefined, Operator.NOT, pAndNotP);
        return notPAndNotP.evaluate();
    }
    static proveLawOfExcludedMiddle(p) {
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, p);
        const pOrNotP = new Proposition('COMPOUND', undefined, Operator.OR, p, notP);
        return pOrNotP.evaluate();
    }
    static proveDoubleNegation(p) {
        const notP = new Proposition('COMPOUND', undefined, Operator.NOT, p);
        const notNotP = new Proposition('COMPOUND', undefined, Operator.NOT, notP);
        const equivalent = new Proposition('COMPOUND', undefined, Operator.EQUIVALENT, notNotP, p);
        return equivalent.evaluate();
    }
}
//# sourceMappingURL=formal_logic.js.map