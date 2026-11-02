import type {
  Card,
  GeneratedTemplate,
  Lang,
  Option,
  Question,
  SourceRef,
  TaxNode,
  Taxonomy,
} from "./types.js";

export interface TaxStructure {
  readonly byId: ReadonlyMap<string, TaxNode>;
  readonly children: ReadonlyMap<string, readonly string[]>;
  readonly parent: ReadonlyMap<string, string | null>;
  readonly depth: ReadonlyMap<string, number>;
  readonly root: string;
}

export function buildTaxStructure(tax: Taxonomy): TaxStructure {
  const byId = new Map<string, TaxNode>();
  const children = new Map<string, string[]>();
  const parent = new Map<string, string | null>();
  const depth = new Map<string, number>();

  for (const n of tax.nodes) {
    byId.set(n.id, n);
    children.set(n.id, []);
    parent.set(n.id, n.parent);
  }

  let rootId: string | null = null;
  for (const n of tax.nodes) {
    if (n.parent === null) {
      if (rootId !== null) {
        throw new Error(`Taxonomy ${tax.id} has multiple roots: ${rootId} and ${n.id}`);
      }
      rootId = n.id;
    } else {
      const list = children.get(n.parent);
      if (list) {
        list.push(n.id);
      }
    }
  }

  if (!rootId) {
    throw new Error(`Taxonomy ${tax.id} has no root node.`);
  }

  const walk = (nid: string, d: number, seen: Set<string>): void => {
    if (seen.has(nid)) {
      throw new Error(`Cycle detected in taxonomy ${tax.id} at node ${nid}`);
    }
    seen.add(nid);
    depth.set(nid, d);
    const ch = children.get(nid) ?? [];
    for (const c of ch) {
      walk(c, d + 1, seen);
    }
  };

  walk(rootId, 0, new Set());

  return {
    byId,
    children,
    parent,
    depth,
    root: rootId,
  };
}

export function getAncestors(st: TaxStructure, nid: string): Set<string> {
  const out = new Set<string>();
  let p = st.parent.get(nid) ?? null;
  while (p !== null) {
    out.add(p);
    p = st.parent.get(p) ?? null;
  }
  return out;
}

export function getDescendants(st: TaxStructure, nid: string): Set<string> {
  const out = new Set<string>();
  const stack = [...(st.children.get(nid) ?? [])];
  while (stack.length > 0) {
    const x = stack.pop();
    if (!x || out.has(x)) continue;
    out.add(x);
    const ch = st.children.get(x);
    if (ch) {
      stack.push(...ch);
    }
  }
  return out;
}

export function getNodeCount(st: TaxStructure, nid: string): number {
  const ch = st.children.get(nid) ?? [];
  if (ch.length === 0) {
    const node = st.byId.get(nid);
    const w = node?.weight;
    return typeof w === "number" && w >= 1 ? w : 1;
  }
  let sum = 0;
  for (const c of ch) {
    sum += getNodeCount(st, c);
  }
  return sum;
}

export function getCategoryPool(st: TaxStructure, x: string): string[] {
  const p = st.parent.get(x) ?? null;
  if (p === null) return [];

  const anc = getAncestors(st, x);
  const desc = getDescendants(st, x);
  const excluded = new Set<string>([...anc, x, p, ...desc]);

  const internal: string[] = [];
  for (const [nid, ch] of st.children.entries()) {
    if (ch.length > 0) internal.push(nid);
  }

  const grandParent = st.parent.get(p) ?? null;
  const sibOfP = grandParent !== null
    ? (st.children.get(grandParent) ?? []).filter((n) => n !== p)
    : [];

  const tier1 = sibOfP.filter((n) => !excluded.has(n) && (st.children.get(n)?.length ?? 0) > 0);
  const tier1Set = new Set(tier1);

  const depthP = st.depth.get(p) ?? -1;
  const tier2 = internal.filter(
    (n) => (st.depth.get(n) ?? -2) === depthP && !excluded.has(n) && !tier1Set.has(n)
  );
  const tier2Set = new Set(tier2);

  const tier3 = internal.filter(
    (n) => !excluded.has(n) && !tier1Set.has(n) && !tier2Set.has(n)
  );

  return [...tier1, ...tier2, ...tier3];
}

export function getOutsidersFor(st: TaxStructure, g: string): string[] {
  const sub = new Set<string>([...getDescendants(st, g), g]);
  const childDepth = (st.depth.get(g) ?? 0) + 1;
  const outsiders: string[] = [];

  for (const [nid, d] of st.depth.entries()) {
    if (d === childDepth && !sub.has(nid) && st.parent.get(nid) !== g) {
      outsiders.push(nid);
    }
  }
  return outsiders;
}

export function getEligibleGeneratedCards(tax: Taxonomy): Card[] {
  const st = buildTaxStructure(tax);
  const cards: Card[] = [];
  const unitMatch = /^u(\d+)\./.exec(tax.id);
  const unitNumber = unitMatch && unitMatch[1] ? parseInt(unitMatch[1], 10) : 1;

  // 1. category
  for (const [nid] of st.byId.entries()) {
    if (nid === st.root) continue;
    if (st.parent.get(nid) === st.root) continue;
    if (getCategoryPool(st, nid).length >= 3) {
      cards.push({
        id: `${tax.id}/${nid}/category`,
        unit: unitNumber,
        kind: "derived",
        origin: "generated",
        requires: [],
        generated: {
          template: "category",
          taxonomy: tax,
          nodeId: nid,
        },
      });
    }
  }

  // 2. count
  for (const [nid, ch] of st.children.entries()) {
    if (ch.length > 0 || getNodeCount(st, nid) >= 2) {
      cards.push({
        id: `${tax.id}/${nid}/count`,
        unit: unitNumber,
        kind: "derived",
        origin: "generated",
        requires: [],
        generated: {
          template: "count",
          taxonomy: tax,
          nodeId: nid,
        },
      });
    }
  }

  // 3. member & intruder
  for (const [nid, ch] of st.children.entries()) {
    if (nid === st.root || ch.length === 0) continue;
    const outs = getOutsidersFor(st, nid);
    if (ch.length >= 2 && outs.length >= 3) {
      cards.push({
        id: `${tax.id}/${nid}/member`,
        unit: unitNumber,
        kind: "derived",
        origin: "generated",
        requires: [],
        generated: {
          template: "member",
          taxonomy: tax,
          nodeId: nid,
        },
      });
    }
    if (ch.length >= 3 && outs.length >= 1) {
      cards.push({
        id: `${tax.id}/${nid}/intruder`,
        unit: unitNumber,
        kind: "derived",
        origin: "generated",
        requires: [],
        generated: {
          template: "intruder",
          taxonomy: tax,
          nodeId: nid,
        },
      });
    }
  }

  return cards;
}

function formatSource(s: SourceRef): string {
  const parts: string[] = [];
  if (s.cma) parts.push(`CMA ${s.cma}`);
  if (s.fund) parts.push(`Fundamentals ${s.fund}`);
  if (s.as) parts.push(`As ${s.as}`);
  return parts.join(", ");
}

/** Embaralha deterministicamente ou aleatoriamente um array. */
function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = res[i]!;
    res[i] = res[j]!;
    res[j] = tmp;
  }
  return res;
}

export function materializeGeneratedQuestion(
  tax: Taxonomy,
  nodeId: string,
  template: GeneratedTemplate,
  lang: Lang,
  rng: () => number = Math.random
): Question {
  const st = buildTaxStructure(tax);
  const node = st.byId.get(nodeId);
  if (!node) {
    throw new Error(`Node ${nodeId} not found in taxonomy ${tax.id}`);
  }

  const unitMatch = /^u(\d+)\./.exec(tax.id);
  const unitNumber = unitMatch && unitMatch[1] ? parseInt(unitMatch[1], 10) : 1;
  const src = formatSource(tax.source);

  let prompt = "";
  let correctText = "";
  const distractorTexts: string[] = [];
  let explanation = "";

  const topic = tax.title[lang];

  switch (template) {
    case "count": {
      const cnt = getNodeCount(st, nodeId);
      const noun = tax.noun[lang];
      if (lang === "en") {
        prompt = `How many ${noun} are in ${node.name.en}?`;
        explanation = `${node.name.en} contains exactly ${cnt} ${noun} (${src}).`;
      } else if (lang === "pt") {
        prompt = `Quantos ${noun} há em ${node.name.pt}?`;
        explanation = `${node.name.pt} contém exatamente ${cnt} ${noun} (${src}).`;
      } else {
        prompt = `¿Cuántos ${noun} hay en ${node.name.es}?`;
        explanation = `${node.name.es} contiene exactamente ${cnt} ${noun} (${src}).`;
      }
      correctText = String(cnt);

      // Distratores: contagens de outros nós ou variações plausíveis
      const otherCounts = new Set<number>();
      for (const [nid] of st.byId.entries()) {
        if (nid !== nodeId) {
          const c = getNodeCount(st, nid);
          if (c !== cnt && c > 0) otherCounts.add(c);
        }
      }
      const candidates = Array.from(otherCounts);
      const chosenCandidates = shuffle(candidates, rng);
      for (const c of chosenCandidates) {
        if (distractorTexts.length >= 3) break;
        distractorTexts.push(String(c));
      }
      // Se não atingiu 3 distratores, gere offsets matemáticos realistas
      const offsets = [2, -2, 4, -4, 6, -6, 1, -1, 3, -3];
      for (const off of offsets) {
        if (distractorTexts.length >= 3) break;
        const val = cnt + off;
        if (val > 0 && val !== cnt && !distractorTexts.includes(String(val))) {
          distractorTexts.push(String(val));
        }
      }
      break;
    }

    case "category": {
      const pId = st.parent.get(nodeId);
      const parentNode = pId ? st.byId.get(pId) : null;
      if (!parentNode) {
        throw new Error(`Node ${nodeId} has no parent for category question`);
      }
      if (lang === "en") {
        prompt = `Under which category is ${node.name.en} classified?`;
        explanation = `${node.name.en} is classified under ${parentNode.name.en} (${src}).`;
      } else if (lang === "pt") {
        prompt = `Sob qual categoria ${node.name.pt} é classificado?`;
        explanation = `${node.name.pt} é classificado sob ${parentNode.name.pt} (${src}).`;
      } else {
        prompt = `¿Bajo qué categoría se clasifica ${node.name.es}?`;
        explanation = `${node.name.es} se clasifica bajo ${parentNode.name.es} (${src}).`;
      }
      correctText = parentNode.name[lang];

      const pool = getCategoryPool(st, nodeId);
      const shuffledPool = shuffle(pool, rng);
      for (const id of shuffledPool) {
        if (distractorTexts.length >= 3) break;
        const cand = st.byId.get(id);
        if (cand && cand.name[lang] !== correctText && !distractorTexts.includes(cand.name[lang])) {
          distractorTexts.push(cand.name[lang]);
        }
      }
      break;
    }

    case "member": {
      const ch = st.children.get(nodeId) ?? [];
      const shuffledCh = shuffle(ch, rng);
      const correctChildId = shuffledCh[0];
      const correctChild = correctChildId ? st.byId.get(correctChildId) : null;
      if (!correctChild) {
        throw new Error(`No children found for member question on ${nodeId}`);
      }

      if (lang === "en") {
        prompt = `Which of the following belongs to ${node.name.en}?`;
        explanation = `${correctChild.name.en} belongs to ${node.name.en} (${src}).`;
      } else if (lang === "pt") {
        prompt = `Qual dos seguintes pertence a ${node.name.pt}?`;
        explanation = `${correctChild.name.pt} pertence a ${node.name.pt} (${src}).`;
      } else {
        prompt = `¿Cuál de los siguientes pertenece a ${node.name.es}?`;
        explanation = `${correctChild.name.es} pertenece a ${node.name.es} (${src}).`;
      }
      correctText = correctChild.name[lang];

      const outsiders = getOutsidersFor(st, nodeId);
      const shuffledOut = shuffle(outsiders, rng);
      for (const oId of shuffledOut) {
        if (distractorTexts.length >= 3) break;
        const outNode = st.byId.get(oId);
        if (outNode && outNode.name[lang] !== correctText && !distractorTexts.includes(outNode.name[lang])) {
          distractorTexts.push(outNode.name[lang]);
        }
      }
      break;
    }

    case "intruder": {
      const outsiders = getOutsidersFor(st, nodeId);
      const shuffledOut = shuffle(outsiders, rng);
      const intruderId = shuffledOut[0];
      if (!intruderId) {
        throw new Error(`No outsiders found for intruder question on ${nodeId}`);
      }
      const intruderNode = st.byId.get(intruderId);
      if (!intruderNode) {
        throw new Error(`No outsider node found for id ${intruderId}`);
      }

      const intruderParentId = st.parent.get(intruderId);
      const intruderParent = intruderParentId ? st.byId.get(intruderParentId) : null;
      const intruderParentName = intruderParent ? intruderParent.name[lang] : "";

      if (lang === "en") {
        prompt = `Which of the following does NOT belong to ${node.name.en}?`;
        explanation = `${intruderNode.name.en} does not belong to ${node.name.en}${intruderParentName ? ` (belongs to ${intruderParentName})` : ""} (${src}).`;
      } else if (lang === "pt") {
        prompt = `Qual dos seguintes NÃO pertence a ${node.name.pt}?`;
        explanation = `${intruderNode.name.pt} não pertence a ${node.name.pt}${intruderParentName ? ` (pertence a ${intruderParentName})` : ""} (${src}).`;
      } else {
        prompt = `¿Cuál de los siguientes NO pertenece a ${node.name.es}?`;
        explanation = `${intruderNode.name.es} no pertenece a ${node.name.es}${intruderParentName ? ` (pertenece a ${intruderParentName})` : ""} (${src}).`;
      }
      correctText = intruderNode.name[lang];

      const ch = st.children.get(nodeId) ?? [];
      const shuffledCh = shuffle(ch, rng);
      for (const cId of shuffledCh) {
        if (distractorTexts.length >= 3) break;
        const cNode = st.byId.get(cId);
        if (cNode && cNode.name[lang] !== correctText && !distractorTexts.includes(cNode.name[lang])) {
          distractorTexts.push(cNode.name[lang]);
        }
      }
      break;
    }
  }

  const rawOptions: { text: string; isCorrect: boolean }[] = [
    { text: correctText, isCorrect: true },
    ...distractorTexts.map((d) => ({ text: d, isCorrect: false })),
  ];

  const shuffledOptions = shuffle(rawOptions, rng);
  const keys = ["A", "B", "C", "D", "E"].slice(0, shuffledOptions.length);

  const options: Option[] = shuffledOptions.map((opt, idx) => ({
    key: keys[idx] ?? String(idx + 1),
    text: opt.text,
    isCorrect: opt.isCorrect,
  }));

  return {
    cardId: `${tax.id}/${nodeId}/${template}`,
    unit: unitNumber,
    topic,
    prompt,
    options,
    explanation,
  };
}
