import { lookupOnline } from '../../services/onlineDictionaryService';
import * as FileSystem from 'expo-file-system';

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://mock-directory/',
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
}));

describe('Online Dictionary Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should return null if fetch fails immediately', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const result = await lookupOnline('networkerrorword');
    expect(result).toBeNull();
  });

  it('should fetch from API and cache the result', async () => {
    const mockApiResponse = [{
      dictname: 'dpd',
      definition: ['liberation'],
    }];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    });

    const result = await lookupOnline('nibbana');
    expect(result).not.toBeNull();
    if (result) {
      expect(result.pali).toBe('nibbana');
      expect(result.meaning.en).toContain('liberation');
    }
  });

  it('should return null if word is not found in API', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    const result = await lookupOnline('unknownword');
    expect(result).toBeNull();
  });
});
