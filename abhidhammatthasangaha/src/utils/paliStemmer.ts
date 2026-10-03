export function normalizePali(word: string): string {
  return word.toLowerCase().replace(/[.,;:!?()"\n\r]/g, '').trim();
}

/**
 * Remove sufixos comuns do Pali (declinações/conjugações simples)
 * para tentar encontrar o radical no dicionário.
 */
export function getPaliStems(word: string): string[] {
  const normal = normalizePali(word);
  if (!normal) return [];

  const stems = new Set<string>();
  stems.add(normal);

  // Sufixos comuns de declinação (Acc, Dat, Gen, Loc, Inst, Abl, Plurais)
  const suffixes = [
    'ṃ', 'ssa', 'āya', 'smā', 'mhā', 'mhi', 'smiṃ', 'ena', 
    'e', 'ā', 'i', 'ī', 'u', 'ū', 'su', 'naṃ', 'ānaṃ', 'bhi', 'hi',
    'to', 'so'
  ];

  for (const suffix of suffixes) {
    if (normal.endsWith(suffix) && normal.length > suffix.length + 1) {
      // Ex: sīlaṃ -> sīla
      stems.add(normal.slice(0, -suffix.length));
      
      // Regra de compensação para alongamentos antes do sufixo (ex: dhammānaṃ -> dhamma)
      if (normal.charAt(normal.length - suffix.length - 1) === 'ā') {
         const base = normal.slice(0, -suffix.length - 1) + 'a';
         stems.add(base);
      }
    }
  }

  return Array.from(stems);
}
