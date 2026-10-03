// src/data/chapters/chapterLoader.ts
// Dynamically loads chapter data by ID
import type { Segment } from '../../types/models';

// Static imports for all chapters (Metro bundler requires static requires)
const chapterModules: Record<string, Segment[]> = {};

// Lazy loader that caches
export async function loadChapter(chapterId: string): Promise<Segment[]> {
  if (chapterModules[chapterId]) {
    return chapterModules[chapterId];
  }

  let data: Segment[];
  try {
    // Dynamic require mapped to static imports
    switch (chapterId) {
      case 'ch01': data = require('./ch01.json'); break;
      case 'ch02': data = require('./ch02.json'); break;
      case 'ch03': data = require('./ch03.json'); break;
      case 'ch04': data = require('./ch04.json'); break;
      case 'ch05': data = require('./ch05.json'); break;
      case 'ch06': data = require('./ch06.json'); break;
      case 'ch07': data = require('./ch07.json'); break;
      case 'ch08': data = require('./ch08.json'); break;
      case 'ch09': data = require('./ch09.json'); break;
      case 'ch10': data = require('./ch10.json'); break;
      case 'ch11': data = require('./ch11.json'); break;
      case 'ch12': data = require('./ch12.json'); break;
      case 'ch13': data = require('./ch13.json'); break;
      case 'ch14': data = require('./ch14.json'); break;
      case 'ch15': data = require('./ch15.json'); break;
      case 'ch16': data = require('./ch16.json'); break;
      case 'ch17': data = require('./ch17.json'); break;
      case 'ch18': data = require('./ch18.json'); break;
      case 'ch19': data = require('./ch19.json'); break;
      case 'ch20': data = require('./ch20.json'); break;
      case 'ch21': data = require('./ch21.json'); break;
      case 'ch22': data = require('./ch22.json'); break;
      case 'ch23': data = require('./ch23.json'); break;
      default: data = [];
    }
  } catch {
    data = [];
  }

  chapterModules[chapterId] = data;
  return data;
}

export function getLoadedChapter(chapterId: string): Segment[] | null {
  return chapterModules[chapterId] || null;
}
