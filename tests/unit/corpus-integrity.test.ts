import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

function parseTtfCmap(buf: Buffer): Set<number> {
  const cps = new Set<number>();
  const numTables = buf.readUInt16BE(4);
  let cmapOff = -1;
  for (let i = 0; i < numTables; i++) {
    const off = 12 + i * 16;
    if (buf.subarray(off, off + 4).toString("ascii") === "cmap") {
      cmapOff = buf.readUInt32BE(off + 8);
      break;
    }
  }
  if (cmapOff < 0) return cps;
  const numSub = buf.readUInt16BE(cmapOff + 2);
  for (let i = 0; i < numSub; i++) {
    const sub = cmapOff + buf.readUInt32BE(cmapOff + 4 + i * 8 + 4);
    const fmt = buf.readUInt16BE(sub);
    if (fmt === 4) {
      const segCountX2 = buf.readUInt16BE(sub + 6);
      const segCount = segCountX2 / 2;
      for (let s = 0; s < segCount; s++) {
        const endCode = buf.readUInt16BE(sub + 14 + s * 2);
        const startCode = buf.readUInt16BE(sub + 16 + segCountX2 + s * 2);
        const idDelta = buf.readInt16BE(sub + 16 + 2 * segCountX2 + s * 2);
        const idRangeOff = buf.readUInt16BE(sub + 16 + 3 * segCountX2 + s * 2);
        if (startCode === 0xffff && endCode === 0xffff) continue;
        for (let cp = startCode; cp <= endCode; cp++) {
          let gid = 0;
          if (idRangeOff === 0) {
            gid = (cp + idDelta) & 0xffff;
          } else {
            const roPos = sub + 16 + 3 * segCountX2 + s * 2;
            const gPos = roPos + idRangeOff + (cp - startCode) * 2;
            gid = buf.readUInt16BE(gPos);
            if (gid !== 0) gid = (gid + idDelta) & 0xffff;
          }
          if (gid !== 0) cps.add(cp);
        }
      }
    }
  }
  return cps;
}

describe("Full Corpus Encoding, Diacritic & Font Glyph Integrity", () => {
  it("contains zero C0/C1 controls, zero garbled non-Latin scripts, zero undecoded HTML entities, and 100% Gentium Book Plus glyph coverage across all 21 works", () => {
    const worksDir = path.join(ROOT, "data/works");
    const fontRegCmap = parseTtfCmap(fs.readFileSync(path.join(ROOT, "fonts/GentiumBookPlus-Regular.ttf")));
    const fontItaCmap = parseTtfCmap(fs.readFileSync(path.join(ROOT, "fonts/GentiumBookPlus-Italic.ttf")));

    const badCtrlRe = /[\x00-\x09\x0b-\x1f\x7f-\x9f\ufffd]/;
    const badScriptRe = /[\u0900-\u1dff\u2c00-\ud7ff\uf900-\uffef]/;
    const badEntityRe = /&(?!amp;|lt;|gt;|quot;|apos;)([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/;

    let totalSegments = 0;
    const issues: string[] = [];

    for (const workSlug of fs.readdirSync(worksDir)) {
      const workPath = path.join(worksDir, workSlug);
      if (!fs.statSync(workPath).isDirectory()) continue;
      for (const file of fs.readdirSync(workPath)) {
        if (!file.endsWith(".json") || file === "index.json") continue;
        const segs = JSON.parse(fs.readFileSync(path.join(workPath, file), "utf8"));
        if (!Array.isArray(segs)) continue;
        for (const seg of segs) {
          totalSegments++;
          for (const fld of ["pali", "en", "pt", "es"] as const) {
            const val = seg[fld];
            if (typeof val !== "string" || !val) continue;
            if (badCtrlRe.test(val)) {
              issues.push(`CTRL ${workSlug}/${file}#${seg.id}[${fld}]`);
            }
            if (badScriptRe.test(val)) {
              issues.push(`SCRIPT ${workSlug}/${file}#${seg.id}[${fld}]`);
            }
            if (val.includes("&") && badEntityRe.test(val)) {
              issues.push(`ENTITY ${workSlug}/${file}#${seg.id}[${fld}]`);
            }
            for (let i = 0; i < val.length; i++) {
              const cp = val.charCodeAt(i);
              if (cp > 127 && (!fontRegCmap.has(cp) || !fontItaCmap.has(cp))) {
                issues.push(`GLYPH U+${cp.toString(16)} in ${workSlug}/${file}#${seg.id}[${fld}]`);
                break;
              }
            }
          }
        }
      }
    }

    expect(totalSegments).toBeGreaterThan(90_000);
    expect(issues).toEqual([]);
  }, 30_000);

  it("enforces strict Pāli technical terminology preservation (zero Sanskritisms and zero fenômeno/fenómeno substitutions) across PT & ES corpus, dictionaries, SRS, and Mnemonic Lab", () => {
    const forbiddenRe = /\b(dharma|dharmas|karma|karmas|kármic[oa]s?|cármic[oa]s?|nirvana|sutra|sutras|arhat|arhats|bodhisattva|bodhisattvas|bodisatva|bodisatvas|samsara|skandha|skandhas|dhyana|dhyanas|fen[ôó]menos?)\b/i;
    const violations: string[] = [];

    // 1. Dictionaries (common_pali.json & pali_core.json)
    const commonPali = JSON.parse(fs.readFileSync(path.join(ROOT, "data/dictionary/common_pali.json"), "utf8"));
    for (const e of commonPali.entries) {
      for (const fld of ["pt", "es"] as const) {
        if (typeof e[fld] === "string" && forbiddenRe.test(e[fld])) {
          violations.push(`common_pali:${e.h}[${fld}]`);
        }
      }
    }

    const corePali = JSON.parse(fs.readFileSync(path.join(ROOT, "data/dictionary/pali_core.json"), "utf8"));
    for (const e of corePali.entries) {
      for (const s of e.senses ?? []) {
        for (const fld of ["pt", "es"] as const) {
          if (typeof s[fld] === "string" && forbiddenRe.test(s[fld])) {
            violations.push(`pali_core:${e.h}[${fld}]:${s[fld].match(forbiddenRe)?.[0]}`);
          }
        }
      }
    }

    // 2. SRS decks (vocabulary.json & abhidhamma_cards.json)
    const vocab = JSON.parse(fs.readFileSync(path.join(ROOT, "data/srs/vocabulary.json"), "utf8"));
    for (const c of vocab.cards) {
      for (const fld of ["pt", "es"] as const) {
        if (typeof c[fld] === "string" && forbiddenRe.test(c[fld])) {
          violations.push(`srs_vocab:${c.id}[${fld}]`);
        }
      }
    }
    const abhiCards = JSON.parse(fs.readFileSync(path.join(ROOT, "data/srs/abhidhamma_cards.json"), "utf8"));
    const walkCards = (obj: any, prefix: string) => {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => walkCards(v, `${prefix}[${i}]`));
      } else if (obj && typeof obj === "object") {
        for (const [k, v] of Object.entries(obj)) {
          if ((k === "pt" || k === "es") && typeof v === "string" && forbiddenRe.test(v)) {
            violations.push(`abhi_cards:${prefix}.${k}:${v.match(forbiddenRe)?.[0]}`);
          } else {
            walkCards(v, `${prefix}.${k}`);
          }
        }
      }
    };
    walkCards(abhiCards.cards, "cards");

    // 3. Mnemonic Lab TS modules
    const walkDir = (dir: string): string[] =>
      fs.readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return fs.statSync(p).isDirectory() ? walkDir(p) : p.endsWith(".ts") ? [p] : [];
      });
    for (const fp of walkDir(path.join(ROOT, "src/mnemonic-lab"))) {
      const txt = fs.readFileSync(fp, "utf8");
      const m = txt.match(forbiddenRe);
      if (m) violations.push(`mnemonic-lab:${path.basename(fp)}:${m[0]}`);
    }

    // 4. Full works corpus (PT & ES)
    const brokenEsGenderRe = /\b(?:los|estos|esos|aquellos|otros|unos|ciertos|muchos|varios|diversos|dichos|mismos|ambos)\s+realidades\b/i;
    const worksDir = path.join(ROOT, "data/works");
    for (const workSlug of fs.readdirSync(worksDir)) {
      const workPath = path.join(worksDir, workSlug);
      if (!fs.statSync(workPath).isDirectory()) continue;
      for (const file of fs.readdirSync(workPath)) {
        if (!file.endsWith(".json") || file === "index.json") continue;
        const segs = JSON.parse(fs.readFileSync(path.join(workPath, file), "utf8"));
        if (!Array.isArray(segs)) continue;
        for (const seg of segs) {
          for (const fld of ["pt", "es"] as const) {
            const val = seg[fld];
            if (typeof val === "string" && forbiddenRe.test(val)) {
              violations.push(`${workSlug}/${file}#${seg.id}[${fld}]:${val.match(forbiddenRe)?.[0]}`);
            }
            if (fld === "es" && typeof val === "string" && brokenEsGenderRe.test(val)) {
              violations.push(`${workSlug}/${file}#${seg.id}[es-gender]:${val.match(brokenEsGenderRe)?.[0]}`);
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  }, 30_000);

  it("has zero orphan or missing search index shards relative to data/search/manifest.json", () => {
    const searchDir = path.join(ROOT, "data/search");
    const manifest = JSON.parse(fs.readFileSync(path.join(searchDir, "manifest.json"), "utf8"));
    const expected = new Set<string>(Object.values(manifest.shards));
    const onDisk = new Set<string>(
      fs.readdirSync(searchDir).filter((f) => f.startsWith("shard_") && f.endsWith(".json"))
    );
    const orphans = [...onDisk].filter((f) => !expected.has(f));
    const missing = [...expected].filter((f) => !onDisk.has(f));
    expect(orphans).toEqual([]);
    expect(missing).toEqual([]);
  });
});
