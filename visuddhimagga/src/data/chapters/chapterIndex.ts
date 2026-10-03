// src/data/chapters/chapterIndex.ts
// Complete Visuddhimagga chapter index — all 23 chapters in 3 parts
import type { Language } from '../../types/models';

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
  { number: 1, pali: 'Sīla-niddesa', titles: { en: 'Virtue', pt: 'Virtude', es: 'Virtud' } },
  { number: 2, pali: 'Samādhi-niddesa', titles: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { number: 3, pali: 'Paññā-niddesa', titles: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
];

export const CHAPTERS: ChapterMeta[] = [
  // Part I — Sīla (Virtue)
  { id: 'ch01', number: 1, paliTitle: 'Sīla-niddesa', titles: { en: 'Description of Virtue', pt: 'Descrição da Virtude', es: 'Descripción de la Virtud' }, part: 1, partPali: 'Sīla-niddesa', partTitle: { en: 'Virtue', pt: 'Virtude', es: 'Virtud' } },
  { id: 'ch02', number: 2, paliTitle: 'Dhutaṅga-niddesa', titles: { en: 'The Ascetic Practices', pt: 'As Práticas Ascéticas', es: 'Las Prácticas Ascéticas' }, part: 1, partPali: 'Sīla-niddesa', partTitle: { en: 'Virtue', pt: 'Virtude', es: 'Virtud' } },

  // Part II — Samādhi (Concentration)
  { id: 'ch03', number: 3, paliTitle: 'Kammaṭṭhāna-gahaṇa-niddesa', titles: { en: 'Taking a Meditation Subject', pt: 'Adotando um Objeto de Meditação', es: 'Adoptando un Objeto de Meditación' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch04', number: 4, paliTitle: 'Pathavī-kasiṇa-niddesa', titles: { en: 'The Earth Kasiṇa', pt: 'O Kasiṇa da Terra', es: 'El Kasiṇa de la Tierra' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch05', number: 5, paliTitle: 'Sesaṃ-kasiṇa-niddesa', titles: { en: 'The Remaining Kasiṇas', pt: 'Os Kasiṇas Restantes', es: 'Los Kasiṇas Restantes' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch06', number: 6, paliTitle: 'Asubha-kammaṭṭhāna-niddesa', titles: { en: 'Foulness as a Meditation Subject', pt: 'A Repulsividade como Objeto de Meditação', es: 'La Repugnancia como Objeto de Meditación' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch07', number: 7, paliTitle: 'Cha-anussati-niddesa', titles: { en: 'Six Recollections', pt: 'Seis Recordações', es: 'Seis Recuerdos' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch08', number: 8, paliTitle: 'Anussati-kammaṭṭhāna-niddesa', titles: { en: 'Other Recollections as Meditation Subjects', pt: 'Outras Recordações como Objetos de Meditação', es: 'Otros Recuerdos como Objetos de Meditación' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch09', number: 9, paliTitle: 'Brahmavihāra-niddesa', titles: { en: 'The Divine Abidings', pt: 'As Moradas Divinas', es: 'Las Moradas Divinas' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch10', number: 10, paliTitle: 'Āruppya-niddesa', titles: { en: 'The Immaterial States', pt: 'Os Estados Imateriais', es: 'Los Estados Inmateriales' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch11', number: 11, paliTitle: 'Samādhi-niddesa', titles: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch12', number: 12, paliTitle: 'Iddhi-niddesa', titles: { en: 'The Supernormal Powers', pt: 'Os Poderes Supranormais', es: 'Los Poderes Supranormales' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },
  { id: 'ch13', number: 13, paliTitle: 'Abhiññā-niddesa', titles: { en: 'Direct Knowledge', pt: 'Conhecimento Direto', es: 'Conocimiento Directo' }, part: 2, partPali: 'Samādhi-niddesa', partTitle: { en: 'Concentration', pt: 'Concentração', es: 'Concentración' } },

  // Part III — Paññā (Understanding)
  { id: 'ch14', number: 14, paliTitle: 'Khandha-niddesa', titles: { en: 'The Aggregates', pt: 'Os Agregados', es: 'Los Agregados' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch15', number: 15, paliTitle: 'Āyatana-dhātu-niddesa', titles: { en: 'The Bases and Elements', pt: 'As Bases e os Elementos', es: 'Las Bases y los Elementos' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch16', number: 16, paliTitle: 'Indriya-sacca-niddesa', titles: { en: 'The Faculties and Truths', pt: 'As Faculdades e as Verdades', es: 'Las Facultades y las Verdades' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch17', number: 17, paliTitle: 'Paññā-bhūmi-niddesa', titles: { en: 'The Soil of Understanding', pt: 'O Solo do Entendimento', es: 'El Suelo del Entendimiento' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch18', number: 18, paliTitle: 'Diṭṭhi-visuddhi-niddesa', titles: { en: 'Purification of View', pt: 'Purificação da Visão', es: 'Purificación de la Visión' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch19', number: 19, paliTitle: 'Kaṅkhā-vitaraṇa-visuddhi-niddesa', titles: { en: 'Purification by Overcoming Doubt', pt: 'Purificação pela Superação da Dúvida', es: 'Purificación por Superación de la Duda' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch20', number: 20, paliTitle: 'Maggāmagga-ñāṇadassana-visuddhi-niddesa', titles: { en: 'Purification by Knowledge and Vision of Path and Not-Path', pt: 'Purificação pelo Conhecimento e Visão do Caminho e Não-Caminho', es: 'Purificación por Conocimiento y Visión del Camino y No-Camino' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch21', number: 21, paliTitle: 'Paṭipadā-ñāṇadassana-visuddhi-niddesa', titles: { en: 'Purification by Knowledge and Vision of the Way', pt: 'Purificação pelo Conhecimento e Visão do Caminho', es: 'Purificación por Conocimiento y Visión del Camino' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch22', number: 22, paliTitle: 'Ñāṇadassana-visuddhi-niddesa', titles: { en: 'Purification by Knowledge and Vision', pt: 'Purificação pelo Conhecimento e Visão', es: 'Purificación por Conocimiento y Visión' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
  { id: 'ch23', number: 23, paliTitle: 'Paññā-niddesa-samāpatti', titles: { en: 'The Benefits of Developing Understanding', pt: 'Os Benefícios do Desenvolvimento do Entendimento', es: 'Los Beneficios del Desarrollo del Entendimiento' }, part: 3, partPali: 'Paññā-niddesa', partTitle: { en: 'Understanding', pt: 'Entendimento', es: 'Entendimiento' } },
];

export function getChapter(id: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getChaptersByPart(part: number): ChapterMeta[] {
  return CHAPTERS.filter((c) => c.part === part);
}
