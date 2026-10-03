import { loadChapter } from '../data/chapters/chapterLoader';
import { CHAPTERS } from '../data/chapters/chapterIndex';

type SearchResult = string; // Segment ID

interface Segment {
  id: string;
  pali: string;
  translations: {
    en?: string;
    pt?: string;
    es?: string;
  };
}

// Armazena todos os segmentos do livro com uma chave pré-computada para velocidade extrema
let allSegments: (Segment & { _searchKey: string })[] | null = null;

/**
 * Normaliza um texto para busca:
 * Remove diacríticos do Pali e transforma em minúsculas
 */
function normalizeForSearch(text: string): string {
  if (!text) return '';
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos comuns
    .replace(/[ā]/g, 'a').replace(/[ī]/g, 'i').replace(/[ū]/g, 'u')
    .replace(/[ñ]/g, 'n').replace(/[ṅ]/g, 'n').replace(/[ṇ]/g, 'n')
    .replace(/[ṭ]/g, 't').replace(/[ḍ]/g, 'd').replace(/[ḷ]/g, 'l')
    .replace(/[ṃ]/g, 'm').replace(/[ṁ]/g, 'm');
}

/**
 * Inicializa a base de busca (carrega todos os capítulos em memória)
 * Pre-calcula as chaves de busca para performance O(N) linear sem Regex em tempo de digitação
 */
export async function buildSearchIndex(): Promise<void> {
  if (allSegments) return; // Já carregado

  const segments: (Segment & { _searchKey: string })[] = [];
  
  // Carrega todos os capítulos
  for (const chapterRef of CHAPTERS) {
    const chapterData = await loadChapter(chapterRef.id);
    if (chapterData) {
      for (const seg of chapterData) {
        const combinedText = [
          seg.pali, 
          seg.translations.en || '', 
          seg.translations.pt || '', 
          seg.translations.es || ''
        ].join(' ');
        
        segments.push({
          ...seg,
          _searchKey: normalizeForSearch(combinedText)
        });
      }
    }
  }

  allSegments = segments;
}

/**
 * Busca em todos os segmentos por um termo usando o cache pré-computado
 */
export function searchSegments(query: string): SearchResult[] {
  if (!query || query.trim() === '' || !allSegments) {
    return [];
  }

  const normalizedQuery = normalizeForSearch(query.trim());
  const results: SearchResult[] = [];

  for (const segment of allSegments) {
    if (segment._searchKey.includes(normalizedQuery)) {
      results.push(segment.id);
    }
  }

  return results;
}

/**
 * Destaca o texto encontrado envolvendo-o em uma tag de marcação <mark> ou texto em negrito
 * Usado para a UI, se necessário.
 */
export function highlightMatch(text: string, query: string): string {
  if (!query || query.trim() === '' || !text) return text;
  
  // Como estamos no React Native, retornamos marcadores de markdown para renderização 
  // O ideal é a UI lidar com a renderização. Retornaremos envolto em asteriscos para simplificar.
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '**$1**');
}
