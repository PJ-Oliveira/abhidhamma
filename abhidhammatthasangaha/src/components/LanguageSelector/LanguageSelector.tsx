// src/components/LanguageSelector/LanguageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLanguages } from '../../store/slices/readingSlice';
import type { Language } from '../../types/models';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
];

export const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentLanguages = useAppSelector((s) => s.reading.languages);
  const activeTranslation = currentLanguages.find((l) => l !== 'pali') || 'en';

  const handleSelect = (lang: Language) => {
    dispatch(setLanguages(['pali', lang]));
  };

  return (
    <View style={styles.container}>
      {LANGUAGES.map(({ code, label }) => (
        <TouchableOpacity
          key={code}
          style={[styles.btn, activeTranslation === code && styles.btnActive]}
          onPress={() => handleSelect(code)}
        >
          <Text style={[styles.label, activeTranslation === code && styles.labelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center' 
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E8DCC8',
  },
  btnActive: { backgroundColor: '#4B2E2A' },
  label: { fontSize: 13, color: '#4B2E2A' },
  labelActive: { color: '#FAF5E4', fontWeight: '600' },
});
