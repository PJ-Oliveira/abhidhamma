import { describe, it, expect, beforeEach } from 'vitest';
import {
  settings,
  updateSettings,
  getHistory,
  pushHistory,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from '../../src/state.js';

describe('State Module (localStorage & settings)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize settings with defaults', () => {
    expect(settings.uiLang).toBe('en');
    expect(settings.translationLang).toBe('en');
    expect(settings.fontSize).toBe(17);
  });

  it('should update and persist settings', () => {
    updateSettings({ fontSize: 22, uiLang: 'en' });
    expect(settings.fontSize).toBe(22);
    expect(settings.uiLang).toBe('en');

    const saved = JSON.parse(localStorage.getItem('atp.settings.v1') || '{}');
    expect(saved.fontSize).toBe(22);
    expect(saved.uiLang).toBe('en');
  });

  it('should manage history correctly (limit to 50)', () => {
    for (let i = 0; i < 55; i++) {
      pushHistory({
        workId: `work-${i}`,
        partKey: '1',
        chunk: 0,
        title: `Test Work ${i}`,
      });
    }
    const history = getHistory();
    expect(history.length).toBe(50);
    expect(history[0].workId).toBe('work-54');
    expect(history[49].workId).toBe('work-5');
  });

  it('should toggle bookmarks correctly', () => {
    const entry = {
      workId: 'ds',
      partKey: '1',
      segId: 10,
      chunk: 0,
      title: 'Dhammasaṅgaṇī',
    };

    expect(isBookmarked('ds', '1', 10)).toBe(false);
    
    // Add
    toggleBookmark(entry);
    expect(isBookmarked('ds', '1', 10)).toBe(true);
    let bookmarks = getBookmarks();
    expect(bookmarks.length).toBe(1);
    expect(bookmarks[0].workId).toBe('ds');

    // Remove
    toggleBookmark(entry);
    expect(isBookmarked('ds', '1', 10)).toBe(false);
    bookmarks = getBookmarks();
    expect(bookmarks.length).toBe(0);
  });
});
