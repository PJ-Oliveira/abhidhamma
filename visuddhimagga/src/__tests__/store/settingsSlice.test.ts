import settingsReducer, { setFontSize } from '../../store/slices/settingsSlice';

describe('settingsSlice', () => {
  it('should return initial state', () => {
    expect(settingsReducer(undefined, { type: 'unknown' })).toEqual({ fontSize: 16, theme: 'light' });
  });

  it('should handle setFontSize', () => {
    const actual = settingsReducer({ fontSize: 16, theme: 'light' }, setFontSize(24));
    expect(actual.fontSize).toEqual(24);
  });
});
