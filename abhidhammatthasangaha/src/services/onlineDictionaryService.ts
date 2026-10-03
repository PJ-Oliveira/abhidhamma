/**
 * Online Pali Dictionary Fallback Service
 * Consulta a API avançada do SuttaCentral.
 * Salva automaticamente no cache de memória e no DISCO (FileSystem) para leitura offline.
 */
import * as FileSystem from 'expo-file-system';
import type { DictionaryEntry } from '../types/models';

const USER_DICT_FILE = FileSystem.documentDirectory + 'user_dictionary_cache.json';
const memoryCache = new Map<string, DictionaryEntry | null>();
let isDiskLoaded = false;

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '').trim();
}

async function initDiskCache() {
  if (isDiskLoaded) return;
  try {
    const fileInfo = await FileSystem.getInfoAsync(USER_DICT_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(USER_DICT_FILE);
      const parsed = JSON.parse(content);
      Object.keys(parsed).forEach(key => memoryCache.set(key, parsed[key]));
    }
  } catch (e) {
    console.warn('Failed to load user dict cache:', e);
  }
  isDiskLoaded = true;
}

async function saveToDisk() {
  try {
    const obj: Record<string, any> = {};
    memoryCache.forEach((value, key) => {
      if (value) obj[key] = value;
    });
    await FileSystem.writeAsStringAsync(USER_DICT_FILE, JSON.stringify(obj));
  } catch (e) {
    console.warn('Failed to save user dict cache:', e);
  }
}

async function fetchFromSuttaCentral(word: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const url = `https://suttacentral.net/api/dictionary_full/${encodeURIComponent(word)}?language=en`;
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.length === 0) return null;

    // Prioriza o DPD (mais rico gramaticalmente), depois ncped, depois pts
    const bestMatch = data.find((d: any) => d.dictname === 'dpd') || 
                      data.find((d: any) => d.dictname === 'ncped') || 
                      data[0];
                      
    let meaningStr = '';
    if (Array.isArray(bestMatch.definition)) {
      meaningStr = bestMatch.definition.map((d: string) => stripHtml(d)).join('; ');
    } else {
      meaningStr = stripHtml(String(bestMatch.definition || ''));
    }
    
    return meaningStr || null;
  } catch (e) {
    return null;
  }
}

export async function lookupOnline(word: string): Promise<DictionaryEntry | null> {
  const key = word.toLowerCase().trim();
  
  await initDiskCache();

  if (memoryCache.has(key)) {
    return memoryCache.get(key) || null;
  }
  
  const enDef = await fetchFromSuttaCentral(key);
  
  if (!enDef) {
    memoryCache.set(key, null);
    return null;
  }
  
  const entry: DictionaryEntry = {
    pali: key,
    meaning: {
      en: `[Cloud] ${enDef}`,
      pt: `[Cloud] ${enDef}`, 
      es: `[Cloud] ${enDef}`,
    },
    grammar: 'from SuttaCentral API',
  };
  
  memoryCache.set(key, entry);
  await saveToDisk(); // Grava no celular
  
  return entry;
}

export function clearOnlineCache(): void {
  memoryCache.clear();
}
