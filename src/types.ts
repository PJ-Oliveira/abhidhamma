export interface Segment {
  id: number;
  rend: string;
  paranum: string | null;
  pali: string;
  en: string;
  pt: string;
  es: string;
  notes?: string[];
}

export interface TocEntry {
  id: number;
  rend: string;
  text: string;
}

export interface WorkPart {
  label: string;
  files: string[];
  toc: TocEntry[];
  count: number;
  chunkStarts?: number[];
}

export interface WorkEntry {
  id: string;
  title: string;
  parts: Record<string, WorkPart>;
}

export interface Manifest {
  groups: Record<string, WorkEntry[]>;
}

export type TranslationLang = "en" | "pt" | "es";
export type UiLang = "pt" | "en" | "es";

export interface Settings {
  translationLang: TranslationLang;
  uiLang: UiLang;
  fontSize: number;
  showPali: boolean;
  showTranslation: boolean;
}

export interface HistoryEntry {
  workId: string;
  partKey: string;
  chunk: number;
  title: string;
  ts: number;
}

export interface BookmarkEntry {
  workId: string;
  partKey: string;
  segId: number;
  chunk: number;
  snippet: string;
  ts: number;
}

export interface DictEntry {
  h: string;
  pos?: string;
  en: string;
  pt: string;
  es: string;
  root?: string;
  syn?: string[];
  usage?: string;
  freq?: number;
}

export interface CommonDictData {
  meta: { version: number; language: string[]; source: string; count: number };
  entries: DictEntry[];
}

export interface DictSense {
  id: string;
  pos?: string;
  grammar?: string;
  root?: string;
  en: string;
  pt: string;
  es: string;
  syn?: string;
  ant?: string;
}

export interface DictRootInfo {
  en: string;
  pt: string;
  es: string;
  sanskrit?: string;
  sanskrit_en?: string;
  sanskrit_pt?: string;
  sanskrit_es?: string;
}

export interface CoreDictEntry {
  h: string;
  freq: number;
  pct: number;
  usage?: string;
  senses: DictSense[];
}

export interface CoreDictData {
  meta: {
    version: number;
    stage: number;
    stage_metric: string;
    pct_target: number;
    pct_covered: number;
    total_corpus_tokens: number;
    language: string[];
    source: string;
    count: number;
  };
  roots: Record<string, DictRootInfo>;
  entries: CoreDictEntry[];
}

export interface SearchHit {
  workId: string;
  partKey: string;
  chunk: number;
  segId: number;
  snippet: string;
}

export interface SearchShard {
  postings: Record<string, number[]>;
  segments: SearchHit[];
}

export interface SearchManifest {
  shards: Record<string, string>;
}
