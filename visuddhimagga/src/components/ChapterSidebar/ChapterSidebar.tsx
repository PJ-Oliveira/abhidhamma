// src/components/ChapterSidebar/ChapterSidebar.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCurrentChapter, setSidebarOpen } from '../../store/slices/readingSlice';
import { CHAPTERS, PARTS } from '../../data/chapters/chapterIndex';

import { useWindowDimensions } from 'react-native';

const SIDEBAR_WIDTH = 340;

export const ChapterSidebar: React.FC = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.reading.sidebarOpen);
  const currentChapterId = useAppSelector((s) => s.reading.currentChapterId);
  const languages = useAppSelector((s) => s.reading.languages);
  const translationLang = languages.includes('pt') ? 'pt' : languages.includes('es') ? 'es' : 'en';

  const handleSelectChapter = (chapterId: string) => {
    dispatch(setCurrentChapter(chapterId));
    dispatch(setSidebarOpen(false));
  };

  const handleClose = () => {
    dispatch(setSidebarOpen(false));
  };

  if (!sidebarOpen) return null;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose} />

      {/* Sidebar panel */}
      <View style={[styles.sidebar, { maxWidth: SCREEN_WIDTH * 0.85 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Visuddhimagga</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>The Path of Purification</Text>

        {/* Chapter list */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {PARTS.map((part) => (
            <View key={part.number} style={styles.partSection}>
              {/* Part header */}
              <View style={styles.partHeader}>
                <Text style={styles.partPali}>{part.pali}</Text>
                <Text style={styles.partTitle}>
                  Part {part.number} — {part.titles[translationLang]}
                </Text>
              </View>

              {/* Chapters in this part */}
              {CHAPTERS.filter((ch) => ch.part === part.number).map((ch) => {
                const isActive = ch.id === currentChapterId;
                return (
                  <TouchableOpacity
                    key={ch.id}
                    style={[styles.chapterRow, isActive && styles.chapterRowActive]}
                    onPress={() => handleSelectChapter(ch.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.chapterLeft}>
                      <Text style={[styles.chapterNumber, isActive && styles.chapterTextActive]}>
                        {ch.number}
                      </Text>
                      <Text
                        style={[styles.chapterPali, isActive && styles.chapterTextActive]}
                        numberOfLines={1}
                      >
                        {ch.paliTitle}
                      </Text>
                    </View>
                    <Text
                      style={[styles.chapterTranslation, isActive && styles.chapterTranslationActive]}
                      numberOfLines={2}
                    >
                      {ch.titles[translationLang]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#2C1810',
    height: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 4, height: 0 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6D0',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { color: '#E8D5B8', fontSize: 16 },
  subtitle: {
    fontSize: 12,
    color: '#A08060',
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontStyle: 'italic',
  },
  scrollView: { flex: 1 },
  partSection: { marginBottom: 8 },
  partHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  partPali: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4A574',
    letterSpacing: 0.3,
  },
  partTitle: {
    fontSize: 11,
    color: '#9A7A5A',
    marginTop: 2,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  chapterRowActive: {
    backgroundColor: '#D4A574',
    borderRadius: 0,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  chapterNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B8956A',
    width: 24,
    textAlign: 'center',
  },
  chapterPali: {
    fontSize: 13,
    color: '#E8D5B8',
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  chapterTextActive: { color: '#2C1810' },
  chapterTranslation: {
    fontSize: 11,
    color: '#8A7050',
    maxWidth: 130,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  chapterTranslationActive: { color: '#3D2218' },
});

export default ChapterSidebar;
