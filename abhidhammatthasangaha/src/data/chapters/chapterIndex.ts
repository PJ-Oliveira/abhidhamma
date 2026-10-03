import { Language } from '../../types/models';

export interface ChapterMeta {
  id: string;
  number: number;
  paliTitle: string;
  titles: Record<Exclude<Language, 'pali'>, string>;
  part: number;
  partTitle: Record<Exclude<Language, 'pali'>, string>;
  partPali: string;
}

export const PARTS: { number: number; pali: string; titles: Record<Exclude<Language, 'pali'>, string> }[] = [
  { number: 1, pali: 'Abhidhammatthasaṅgaha', titles: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
];

export const CHAPTERS: ChapterMeta[] = [
  { id: 'ch01', number: 1, paliTitle: 'Cittaparicchedo', titles: { en: 'Compendium of Consciousness', pt: 'Compêndio da Consciência', es: 'Compendio de la Conciencia' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch02', number: 2, paliTitle: 'Cetasikaparicchedo', titles: { en: 'Compendium of Mental Factors', pt: 'Compêndio dos Fatores Mentais', es: 'Compendio de los Factores Mentales' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch03', number: 3, paliTitle: 'Pakiṇṇakaparicchedo', titles: { en: 'Compendium of the Miscellaneous', pt: 'Compêndio das Miscelâneas', es: 'Compendio de las Misceláneas' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch04', number: 4, paliTitle: 'Vīthiparicchedo', titles: { en: 'Compendium of the Cognitive Process', pt: 'Compêndio do Processo Cognitivo', es: 'Compendio del Proceso Cognitivo' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch05', number: 5, paliTitle: 'Vīthimuttaparicchedo', titles: { en: 'Compendium of the Process-freed', pt: 'Compêndio dos Livres de Processo', es: 'Compendio de los Libres de Proceso' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch06', number: 6, paliTitle: 'Rūpaparicchedo', titles: { en: 'Compendium of Matter', pt: 'Compêndio da Matéria', es: 'Compendio de la Materia' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch07', number: 7, paliTitle: 'Samuccayaparicchedo', titles: { en: 'Compendium of Categories', pt: 'Compêndio das Categorias', es: 'Compendio de las Categorías' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch08', number: 8, paliTitle: 'Paccayaparicchedo', titles: { en: 'Compendium of Conditionality', pt: 'Compêndio da Condicionalidade', es: 'Compendio de la Condicionalidad' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
  { id: 'ch09', number: 9, paliTitle: 'Kammaṭṭhānaparicchedo', titles: { en: 'Compendium of Meditation Subjects', pt: 'Compêndio dos Objetos de Meditação', es: 'Compendio de los Objetos de Meditación' }, part: 1, partPali: 'Abhidhammatthasaṅgaha', partTitle: { en: 'Compendium', pt: 'Compêndio', es: 'Compendio' } },
];

export function getChapter(id: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getChaptersByPart(part: number): ChapterMeta[] {
  return CHAPTERS.filter((c) => c.part === part);
}
