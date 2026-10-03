import readingReducer, {
  setVisibleSegments,
  setLanguages,
  toggleBoldPali,
  setSearchQuery,
  setSearchResults,
  setDictionaryWord,
  setCurrentChapter,
  toggleSidebar,
  setSidebarOpen,
} from '../../store/slices/readingSlice';

describe('readingSlice', () => {
  const initialState = {
    visibleSegmentIds: [],
    languages: ['pali', 'en'] as any,
    boldPali: false,
    searchQuery: '',
    searchResults: [],
    dictionaryWord: null,
    currentChapterId: 'ch01',
    sidebarOpen: false,
  };

  it('should return initial state', () => {
    expect(readingReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setVisibleSegments', () => {
    const actual = readingReducer(initialState, setVisibleSegments(['1', '2']));
    expect(actual.visibleSegmentIds).toEqual(['1', '2']);
  });

  it('should handle setLanguages', () => {
    const actual = readingReducer(initialState, setLanguages(['pali', 'pt'] as any));
    expect(actual.languages).toEqual(['pali', 'pt']);
    
    // Testa fallback pra en caso passe apenas pali
    const fallback = readingReducer(initialState, setLanguages(['pali'] as any));
    expect(fallback.languages).toEqual(['pali', 'en']);
  });

  it('should handle toggleBoldPali', () => {
    const actual = readingReducer(initialState, toggleBoldPali());
    expect(actual.boldPali).toBe(true);
  });

  it('should handle setSearchQuery', () => {
    const actual = readingReducer(initialState, setSearchQuery('test'));
    expect(actual.searchQuery).toBe('test');
  });

  it('should handle setSearchResults', () => {
    const actual = readingReducer(initialState, setSearchResults(['vism-1.1']));
    expect(actual.searchResults).toEqual(['vism-1.1']);
  });

  it('should handle setDictionaryWord', () => {
    const actual = readingReducer(initialState, setDictionaryWord('dhamma'));
    expect(actual.dictionaryWord).toBe('dhamma');
  });

  it('should handle setCurrentChapter and clear search', () => {
    const modifiedState = { ...initialState, searchQuery: 'abc', searchResults: ['1'] };
    const actual = readingReducer(modifiedState, setCurrentChapter('ch02'));
    expect(actual.currentChapterId).toBe('ch02');
    expect(actual.searchQuery).toBe('');
    expect(actual.searchResults).toEqual([]);
  });

  it('should handle toggleSidebar and setSidebarOpen', () => {
    const toggled = readingReducer(initialState, toggleSidebar());
    expect(toggled.sidebarOpen).toBe(true);
    const explicitlySet = readingReducer(toggled, setSidebarOpen(false));
    expect(explicitlySet.sidebarOpen).toBe(false);
  });
});
