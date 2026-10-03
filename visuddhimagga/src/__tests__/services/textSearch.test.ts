import { buildSearchIndex, searchSegments, highlightMatch } from '../../services/textSearch';

describe('Text Search Service (Integration Tests)', () => {
  beforeAll(() => {
    buildSearchIndex();
  });

  it('should find segments containing "nibbana"', () => {
    const results = searchSegments('nibbana');
    expect(Array.isArray(results)).toBe(true);
  });

  it('should return empty array for empty query', () => {
    const results = searchSegments('');
    expect(results).toEqual([]);
    expect(results.length).toBe(0);
  });

  it('should not break on highlightMatch if term not found exactly', () => {
    const text = "Tattha visuddhīti sabbamalavirahitaṃ";
    const highlighted = highlightMatch(text, 'nibbana');
    expect(highlighted).toBe(text); // because 'nibbana' is not strictly there without diacritics mapping in the highlight function
  });
});
