import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setDictionaryWord } from '../../store/slices/readingSlice';
import { lookupWord, cleanPaliToken } from '../../services/dictionaryService';
import { lookupOnline } from '../../services/onlineDictionaryService';
import type { DictionaryEntry } from '../../types/models';

export const TermBottomSheet: React.FC = () => {
  const dispatch = useAppDispatch();
  const dictionaryWord = useAppSelector((s) => s.reading.dictionaryWord);
  const languages = useAppSelector((s) => s.reading.languages);
  const translationLang = languages.includes('pt') ? 'pt' : languages.includes('es') ? 'es' : 'en';

  const [onlineEntry, setOnlineEntry] = useState<DictionaryEntry | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Reset online entry when word changes
  useEffect(() => {
    setOnlineEntry(null);
    setIsSearching(false);
  }, [dictionaryWord]);

  if (!dictionaryWord) return null;

  const offlineEntry = lookupWord(dictionaryWord);
  const entry = offlineEntry || onlineEntry;
  const cleanWord = cleanPaliToken(dictionaryWord).toLowerCase();

  const close = () => dispatch(setDictionaryWord(null));

  // Se não achou offline e não está buscando online, inicia busca
  const handleOnlineSearch = async () => {
    if (offlineEntry || isSearching) return;
    setIsSearching(true);
    try {
      const result = await lookupOnline(cleanWord);
      setOnlineEntry(result);
    } catch (e) {
      // Silencioso
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-busca online quando não encontra offline
  useEffect(() => {
    if (!offlineEntry && dictionaryWord) {
      handleOnlineSearch();
    }
  }, [dictionaryWord]);

  return (
    <Modal
      transparent={true}
      visible={!!dictionaryWord}
      animationType="slide"
      onRequestClose={close}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={close}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.paliTitle}>{entry?.pali || cleanWord}</Text>
              {entry?.grammar && (
                <Text style={styles.grammarText}>
                  {entry.grammar === 'online lookup' 
                    ? (translationLang === 'pt' ? '🌐 Consulta online' : translationLang === 'es' ? '🌐 Consulta en línea' : '🌐 Online lookup')
                    : entry.grammar}
                </Text>
              )}
              {entry?.root && <Text style={styles.rootText}>
                {translationLang === 'pt' ? 'Raiz' : translationLang === 'es' ? 'Raíz' : 'Root'}: {entry.root}
              </Text>}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={close}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Definition */}
          <ScrollView contentContainerStyle={styles.definitionBody} bounces={false}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4B2E2A" />
                <Text style={styles.loadingText}>
                  {translationLang === 'pt' ? 'Buscando online...' : translationLang === 'es' ? 'Buscando en línea...' : 'Searching online...'}
                </Text>
              </View>
            ) : entry ? (
              <Text style={styles.meaningText}>
                {entry.meaning[translationLang]}
              </Text>
            ) : (
              <Text style={styles.notFoundText}>
                {translationLang === 'pt' 
                  ? `Definição para "${cleanWord}" não encontrada no dicionário offline nem online.`
                  : translationLang === 'es'
                  ? `Definición para "${cleanWord}" no encontrada en el diccionario offline ni online.`
                  : `Definition for "${cleanWord}" not found in offline or online dictionary.`}
              </Text>
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFDF7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8D8',
    paddingBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  paliTitle: {
    fontFamily: 'NotoSerif_700Bold',
    fontSize: 24,
    color: '#4B2E2A',
    marginBottom: 4,
  },
  grammarText: {
    fontSize: 13,
    color: '#8B7355',
    fontStyle: 'italic',
  },
  rootText: {
    fontSize: 12,
    color: '#C4A882',
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: '#F5EDD8',
    borderRadius: 20,
  },
  closeBtnText: {
    fontSize: 16,
    color: '#4B2E2A',
    fontWeight: 'bold',
  },
  definitionBody: {
    paddingBottom: 24,
  },
  meaningText: {
    fontSize: 17,
    color: '#33271A',
    lineHeight: 26,
  },
  notFoundText: {
    fontStyle: 'italic',
    color: '#8B7355',
    fontSize: 15,
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#8B7355',
    fontSize: 14,
  }
});
