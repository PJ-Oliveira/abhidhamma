// src/components/Dictionary/DictionaryPanel.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { lookupWord, searchDictionary } from '../../services/dictionaryService';
import type { DictionaryEntry } from '../../types/models';
import { useAppSelector } from '../../store/hooks';

const QUICK_TERMS = ['sīla', 'samādhi', 'paññā', 'citta', 'nibbāna', 'kamma'];

export const DictionaryPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);

  // Redux reading state
  const languages = useAppSelector((s) => s.reading.languages);
  const dictionaryWord = useAppSelector((s) => s.reading.dictionaryWord);

  // Active translation language: non-pali language if a single one is selected
  const nonPaliLanguages = (languages || []).filter(
    (lang): lang is 'en' | 'pt' | 'es' => lang === 'en' || lang === 'pt' || lang === 'es'
  );
  const activeLanguage = nonPaliLanguages.length === 1 ? nonPaliLanguages[0] : null;
  const lang = (languages.find((l) => l !== 'pali') || 'en') as 'en' | 'pt' | 'es';

  // Debounce the typed query
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timerId);
  }, [query]);

  // Execute heavy dictionary search when debounced query changes
  React.useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    try {
      const res = searchDictionary(trimmed);
      setResults(res || []);
    } catch {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleCardPress = (entry: DictionaryEntry) => {
    lookupWord(entry.pali);
  };

  // If Redux has an active dictionary word (e.g. tapped from Reader), populate and search
  React.useEffect(() => {
    if (dictionaryWord) {
      handleSearch(dictionaryWord);
    }
  }, [dictionaryWord]);

  const renderTranslations = (entry: DictionaryEntry) => {
    // If a specific language is selected, show that translation
    if (activeLanguage && entry.meaning?.[activeLanguage]) {
      return (
        <View style={styles.translationContainer}>
          <Text style={styles.meaningText}>{entry.meaning[activeLanguage]}</Text>
        </View>
      );
    }

    // If no specific language is selected, show all 3 (en, pt, es)
    const availableLangs: Array<'en' | 'pt' | 'es'> = ['en', 'pt', 'es'];
    return (
      <View style={styles.multiTranslationContainer}>
        {availableLangs.map((langKey) => {
          const text = entry.meaning?.[langKey];
          if (!text) return null;
          return (
            <View key={langKey} style={styles.langRow}>
              <View style={styles.langBadge}>
                <Text style={styles.langBadgeText}>{langKey.toUpperCase()}</Text>
              </View>
              <Text style={styles.multiMeaningText}>{text}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCard = ({ item }: { item: DictionaryEntry }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => handleCardPress(item)}
      >
        {/* Pali word in bold brown (#4B2E2A) */}
        <Text style={styles.paliWord}>{item.pali}</Text>

        {/* Grammar info in grey italic if available */}
        {item.grammar ? (
          <Text style={styles.grammarText}>{item.grammar}</Text>
        ) : null}

        {/* Root info if available */}
        {item.root ? (
          <View style={styles.rootContainer}>
            <Text style={styles.rootLabel}>Raiz: </Text>
            <Text style={styles.rootText}>{item.root}</Text>
          </View>
        ) : null}

        {/* Translations based on active language or all 3 */}
        {renderTranslations(item)}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {lang === 'pt' ? 'Nenhum resultado encontrado.' : lang === 'es' ? 'Ningún resultado encontrado.' : 'No results found.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input Container */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={lang === 'pt' ? 'Buscar termo Pali...' : lang === 'es' ? 'Buscar término Pali...' : 'Search Pali term...'}
          placeholderTextColor="#A89B8C"
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Suggested Quick Terms */}
      <View style={styles.quickTermsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickTermsList}
        >
          {QUICK_TERMS.map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.quickTermChip}
              onPress={() => handleSearch(term)}
            >
              <Text style={styles.quickTermText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results List or Empty Message */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.pali}-${index}`}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default DictionaryPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EC',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DCC8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#4B2E2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#8B7355',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4B2E2A',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 6,
  },
  clearText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: 'bold',
  },
  quickTermsContainer: {
    marginBottom: 14,
  },
  quickTermsList: {
    flexDirection: 'row',
    gap: 8,
  },
  quickTermChip: {
    backgroundColor: '#EADDCB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickTermText: {
    fontSize: 13,
    color: '#4B2E2A',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E6D2',
    shadowColor: '#4B2E2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  paliWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B2E2A',
    marginBottom: 2,
  },
  grammarText: {
    fontSize: 13,
    color: '#7A6E65',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  rootContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rootLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7D6A58',
  },
  rootText: {
    fontSize: 13,
    color: '#6B5E51',
  },
  translationContainer: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5ECE0',
  },
  meaningText: {
    fontSize: 15,
    color: '#3B2E2A',
    lineHeight: 22,
  },
  multiTranslationContainer: {
    marginTop: 6,
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5ECE0',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  langBadge: {
    backgroundColor: '#4B2E2A',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 1,
  },
  langBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF8EC',
  },
  multiMeaningText: {
    flex: 1,
    fontSize: 14,
    color: '#3B2E2A',
    lineHeight: 20,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8B7355',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
