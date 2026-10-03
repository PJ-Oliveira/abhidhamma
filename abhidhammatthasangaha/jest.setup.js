jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://mock-directory/',
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
    Feather: 'Feather',
  };
});
