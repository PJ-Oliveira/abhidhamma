import { lookupWord, searchDictionary } from '../../services/dictionaryService';

describe('Dictionary Service (Unit Tests)', () => {
  it('should find exact pali word', () => {
    const result = lookupWord('sīla');
    expect(result).toBeDefined();
    expect(result?.pali).toBe('sīla');
  });

  it('should be diacritical insensitive', () => {
    // Both 'sila' and 'sīla' should match
    const result = lookupWord('sila');
    expect(result).toBeDefined();
    expect(result?.pali).toBe('sīla');
  });

  it('should return undefined for non-existent word', () => {
    const result = lookupWord('not-a-pali-word');
    expect(result).toBeUndefined();
  });

  it('should search meanings containing string', () => {
    // Should find entry for virtue
    const results = searchDictionary('virtue');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].meaning.en.toLowerCase()).toContain('virtue');
  });
  
  it('should sort results by relevancy', () => {
    // 'kamma' exact match should be first before partials
    const results = searchDictionary('kamma');
    expect(results[0].pali.toLowerCase()).toBe('kamma');
  });
});
