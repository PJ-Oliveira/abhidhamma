// src/services/dictionaryService.ts
// Import DictionaryEntry from '../../types/models' (from 2-level subdirectories) or '../types/models'
import type { DictionaryEntry } from '../types/models';
import rawDictionary from '../data/paliDictionary.json';

export type { DictionaryEntry };

/**
 * Normalizes Pali text by stripping diacritical marks (macrons, dots, tildes)
 * and converting to lower case for case-insensitive and diacritic-flexible matching.
 */
export function normalizePali(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

interface IndexedDictionaryEntry extends DictionaryEntry {
  _searchKeyPali: string;
  _searchKeyEn: string;
  _searchKeyPt: string;
  _searchKeyEs: string;
}

const indexedDictionary: IndexedDictionaryEntry[] = (rawDictionary as DictionaryEntry[]).map(entry => ({
  ...entry,
  _searchKeyPali: normalizePali(entry.pali),
  _searchKeyEn: normalizePali(entry.meaning?.en || ''),
  _searchKeyPt: normalizePali(entry.meaning?.pt || ''),
  _searchKeyEs: normalizePali(entry.meaning?.es || ''),
}));

export const paliDictionary: DictionaryEntry[] = indexedDictionary;

/**
 * Strips non-alphanumeric punctuation and enclosing quotes/parentheses from a token.
 */
export function cleanPaliToken(text: string): string {
  if (!text) return '';
  return text
    .replace(/^[^a-zA-ZāīūñṅṭḍṇḷṃĀĪŪÑṄṬḌṆḶṂ0-9]+|[^a-zA-ZāīūñṅṭḍṇḷṃĀĪŪÑṄṬḌṆḶṂ0-9]+$/g, '')
    .trim();
}

/**
 * Generates candidate stem variations for inflected Pali words.
 * For example:
 * - 'sīle', 'sīlassa', 'sīlena', 'sīlaṃ' -> 'sīla'
 * - 'paññāya' -> 'paññā'
 * - 'dhammo', 'dhammā', 'dhammānaṃ', 'dhammehi' -> 'dhamma'
 */
function getCandidateStems(word: string): string[] {
  const candidates: string[] = [word];
  const norm = normalizePali(word);
  if (norm !== word) {
    candidates.push(norm);
  }

  // Common Pali nominal inflection endings paired with their base stem replacement
  const endings: [string, string][] = [
    ['assa', 'a'],   // Genitive/dative singular
    ['ānaṃ', 'a'],   // Genitive plural
    ['anam', 'a'],   // Genitive plural (normalized)
    ['ena', 'a'],    // Instrumental singular
    ['ehi', 'a'],    // Instrumental/ablative plural
    ['āya', 'a'],    // Dative/genitive singular (-a stems)
    ['āya', 'ā'],    // Dative/genitive singular (-ā stems)
    ['aya', 'a'],    // Normalized dative (-a stems)
    ['aya', 'ā'],    // Normalized dative (-ā stems)
    ['aṃ', 'a'],     // Accusative singular
    ['am', 'a'],     // Accusative singular (normalized)
    ['o', 'a'],      // Nominative singular masculine
    ['e', 'a'],      // Locative singular
    ['ā', 'a'],      // Nominative plural / ablative
    ['ī', 'i'],      // Sandhi lengthening
    ['ū', 'u'],      // Sandhi lengthening
  ];

  for (const [suffix, replacement] of endings) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      candidates.push(word.slice(0, -suffix.length) + replacement);
    }
    if (norm.endsWith(suffix) && norm.length > suffix.length + 1) {
      candidates.push(norm.slice(0, -suffix.length) + replacement);
    }
  }

  return Array.from(new Set(candidates));
}

// Cache de memória global para lookups O(1)
const lookupCache = new Map<string, DictionaryEntry | null>();

/**
 * Looks up a Pali word in the Visuddhimagga dictionary.
 * Performs case-insensitive, diacritical-flexible matching,
 * and handles common Pali inflectional endings.
 *
 * @param word The Pali word or token to look up.
 * @returns The matching DictionaryEntry, or undefined if no match is found.
 */
export function lookupWord(word: string): DictionaryEntry | undefined {
  if (!word) return undefined;
  const clean = cleanPaliToken(word);
  if (!clean) return undefined;

  // Verifica o cache ultrarrápido O(1)
  const cacheKey = clean;
  if (lookupCache.has(cacheKey)) {
    const cached = lookupCache.get(cacheKey);
    return cached ? cached : undefined;
  }

  const rawLower = clean.toLowerCase();

  // Função helper para retornar e salvar no cache
  const resolve = (entry?: DictionaryEntry) => {
    lookupCache.set(cacheKey, entry || null);
    return entry;
  };

  // Phase 1: Exact case-insensitive match
  const exact = paliDictionary.find(
    (e) => e.pali.toLowerCase() === rawLower
  );
  if (exact) return resolve(exact);

  // Phase 2: Diacritical-flexible exact match
  const normWord = normalizePali(clean);
  const diacriticMatch = paliDictionary.find(
    (e) => normalizePali(e.pali) === normWord
  );
  if (diacriticMatch) return resolve(diacriticMatch);

  // Phase 3: Morphological/stem matching
  const stems = getCandidateStems(clean);
  for (const stem of stems) {
    const stemNorm = normalizePali(stem);
    const stemMatch = paliDictionary.find(
      (e) =>
        normalizePali(e.pali) === stemNorm ||
        e.pali.toLowerCase() === stem.toLowerCase()
    );
    if (stemMatch) return resolve(stemMatch);
  }

  // Phase 4 foi removida. Qualquer palavra complexa ou raiz não mapeada localmente
  // será enviada para o Fallback Online (SuttaCentral/DPD API) de forma segura.

  return resolve(undefined);
}

/**
 * Searches the dictionary across Pali words and all translations (EN, PT, ES).
 * Performs case-insensitive and diacritical-flexible substring matching.
 * Results are sorted by relevance (exact Pali match > prefix match > substring match).
 *
 * @param query The search term.
 * @returns An array of matching DictionaryEntry objects.
 */
export function searchDictionary(query: string): DictionaryEntry[] {
  if (!query) return [];
  const normQuery = normalizePali(query);
  if (!normQuery) return [];

  const matched = indexedDictionary.filter((entry) => {
    return (
      entry._searchKeyPali.includes(normQuery) ||
      entry._searchKeyEn.includes(normQuery) ||
      entry._searchKeyPt.includes(normQuery) ||
      entry._searchKeyEs.includes(normQuery)
    );
  });

  // Relevance ranking: exact Pali match > Pali prefix > Pali substring > meaning match
  return matched.sort((a, b) => {
    const score = (entry: IndexedDictionaryEntry): number => {
      const pNorm = entry._searchKeyPali;
      if (pNorm === normQuery) return 100;
      if (pNorm.startsWith(normQuery)) return 80;
      if (pNorm.includes(normQuery)) return 60;
      return 20;
    };
    return score(b) - score(a);
  });
}

/**
 * Returns all entries in the Pali dictionary.
 */
export function getAllEntries(): DictionaryEntry[] {
  return paliDictionary;
}

/**
 * Returns the total number of entries in the Pali dictionary.
 */
export function getDictionaryCount(): number {
  return paliDictionary.length;
}

export default {
  lookupWord,
  searchDictionary,
  getAllEntries,
  getDictionaryCount,
  normalizePali,
  cleanPaliToken,
  paliDictionary,
};
