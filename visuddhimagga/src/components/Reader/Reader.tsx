// src/components/Reader/Reader.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setDictionaryWord } from '../../store/slices/readingSlice';
import { InteractivePaliText } from './InteractivePaliText';
import type { Segment } from '../../types/models';

interface ReaderProps {
  segments: Segment[];
}

export const Reader: React.FC<ReaderProps> = ({ segments }) => {
  const dispatch = useAppDispatch();
  const languages = useAppSelector((s) => s.reading.languages);
  const boldPali = useAppSelector((s) => s.reading.boldPali);
  const fontSize = useAppSelector((s) => s.settings.fontSize);
  const searchResults = useAppSelector((s) => s.reading.searchResults);
  const searchQuery = useAppSelector((s) => s.reading.searchQuery);

  const translationLang = languages.find((l) => l !== 'pali') || 'en';

  // Filter by search if active
  const visibleSegments = React.useMemo(() => {
    if (searchQuery && searchResults.length > 0) {
      return segments.filter((seg) => searchResults.includes(seg.id));
    } else if (searchQuery && searchResults.length === 0) {
      return [];
    } else {
      return segments;
    }
  }, [segments, searchQuery, searchResults]);

  if (visibleSegments.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>{searchQuery ? '🔍' : '📖'}</Text>
        <Text style={styles.emptyText}>
          {searchQuery
            ? `Nenhum resultado para "${searchQuery}"`
            : 'Nenhum segmento neste capítulo.'}
        </Text>
      </View>
    );
  }

  const renderItem = React.useCallback(({ item }: { item: Segment }) => {
    const translation = item.translations[translationLang as keyof typeof item.translations];
    return (
      <View style={styles.segmentCard}>
        <View style={styles.segmentNumber}>
          <Text style={styles.segmentNumberText}>{item.id}</Text>
        </View>
        <InteractivePaliText 
          text={item.pali} 
          style={[styles.paliText, boldPali ? styles.bold : {}, { fontSize }]} 
        />
        {translation && (
          <Text style={[styles.translationText, { fontSize: fontSize - 1 }]}>
            {translation}
          </Text>
        )}
      </View>
    );
  }, [translationLang, boldPali, fontSize]);

  return (
    <FlatList
      data={visibleSegments}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 20 },
  segmentCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentNumber: { marginBottom: 8 },
  segmentNumberText: {
    fontSize: 11,
    color: '#B8A080',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  paliText: { color: '#4B2E2A', lineHeight: 28, marginBottom: 10 },
  paliWord: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#C4A882',
  },
  bold: { fontWeight: 'bold' },
  translationText: {
    color: '#5D4E37',
    lineHeight: 24,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#F0E8D8',
    paddingTop: 10,
  },
  separator: { height: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#8B7355', textAlign: 'center' },
});

export default Reader;
