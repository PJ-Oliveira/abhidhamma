// src/components/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform, StatusBar } from 'react-native';
import { Reader } from './Reader/Reader';
import { LanguageSelector } from './LanguageSelector/LanguageSelector';
import { SearchBar } from './SearchBar/SearchBar';
import { DictionaryPanel } from './Dictionary/DictionaryPanel';
import { TermBottomSheet } from './Dictionary/TermBottomSheet';
import { ChapterSidebar } from './ChapterSidebar/ChapterSidebar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, setCurrentChapter } from '../store/slices/readingSlice';
import { CHAPTERS, getChapter } from '../data/chapters/chapterIndex';
import { loadChapter } from '../data/chapters/chapterLoader';
import { buildSearchIndex } from '../services/textSearch';
import type { Segment } from '../types/models';

type Tab = 'reader' | 'dictionary';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const currentChapterId = useAppSelector((s) => s.reading.currentChapterId);
  const languages = useAppSelector((s) => s.reading.languages);
  const translationLang = languages.includes('pt') ? 'pt' : languages.includes('es') ? 'es' : 'en';
  const { width } = useWindowDimensions();
  const isNarrowScreen = width < 600; // Ponto de quebra para layout em coluna

  const [activeTab, setActiveTab] = useState<Tab>('reader');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);

  const chapter = getChapter(currentChapterId);
  const chapterIndex = CHAPTERS.findIndex((c) => c.id === currentChapterId);

  // Load chapter data when chapter changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadChapter(currentChapterId).then((data) => {
      if (!cancelled) {
        setSegments(data);
        setLoading(false);
      }
    });
    // Fire and forget: carrega índice de pesquisa da nova busca nativa
    buildSearchIndex();
    return () => { cancelled = true; };
  }, [currentChapterId]);

  const isTablet = width >= 768;

  const goToPrev = () => {
    if (chapterIndex > 0) {
      dispatch(setCurrentChapter(CHAPTERS[chapterIndex - 1].id));
    }
  };

  const goToNext = () => {
    if (chapterIndex < CHAPTERS.length - 1) {
      dispatch(setCurrentChapter(CHAPTERS[chapterIndex + 1].id));
    }
  };

  const renderReader = () => (
    <View style={styles.content}>
      <SearchBar />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B2E2A" />
          <Text style={styles.loadingText}>Carregando capítulo...</Text>
        </View>
      ) : (
        <Reader segments={segments} />
      )}

      {/* Chapter navigation */}
      <View style={styles.chapterNav}>
        <TouchableOpacity
          style={[styles.navBtn, chapterIndex <= 0 && styles.navBtnDisabled]}
          onPress={goToPrev}
          disabled={chapterIndex <= 0}
        >
          <Text style={[styles.navBtnText, chapterIndex <= 0 && styles.navBtnTextDisabled]}>
            ← {translationLang === 'pt' ? 'Anterior' : translationLang === 'es' ? 'Anterior' : 'Previous'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.navChapter}>
          {chapter?.number} / {CHAPTERS.length}
        </Text>
        <TouchableOpacity
          style={[styles.navBtn, chapterIndex >= CHAPTERS.length - 1 && styles.navBtnDisabled]}
          onPress={goToNext}
          disabled={chapterIndex >= CHAPTERS.length - 1}
        >
          <Text style={[styles.navBtnText, chapterIndex >= CHAPTERS.length - 1 && styles.navBtnTextDisabled]}>
            {translationLang === 'pt' ? 'Próximo' : translationLang === 'es' ? 'Siguiente' : 'Next'} →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDictionary = () => (
    <View style={styles.content}>
      <DictionaryPanel />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isNarrowScreen && styles.headerNarrow]}>
        <View style={[styles.headerLeft, !isNarrowScreen && styles.headerLeftWide]}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => dispatch(toggleSidebar())}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {chapter ? `${chapter.number}. ${chapter.paliTitle}` : 'Abhidhammatthasaṅgaha'}
            </Text>
            <Text style={styles.titleTranslation} numberOfLines={1}>
              {chapter?.titles[translationLang]}
            </Text>
          </View>
        </View>
        <View style={[styles.languageSelectorContainer, isNarrowScreen && styles.languageSelectorContainerNarrow]}>
          <LanguageSelector />
        </View>
      </View>

      {/* Content Area */}
      {isTablet ? (
        // Split view para Tablet / iPad
        <View style={styles.tabletSplitContainer}>
          <View style={styles.tabletMainContent}>
             {renderReader()}
          </View>
          <View style={styles.tabletSideContent}>
             {renderDictionary()}
          </View>
        </View>
      ) : (
        // Tab view para Mobile
        <>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reader' && styles.tabActive]}
              onPress={() => setActiveTab('reader')}
            >
              <Text style={[styles.tabText, activeTab === 'reader' && styles.tabTextActive]}>
                📖 {translationLang === 'pt' ? 'Leitor' : translationLang === 'es' ? 'Lector' : 'Reader'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'dictionary' && styles.tabActive]}
              onPress={() => setActiveTab('dictionary')}
            >
              <Text style={[styles.tabText, activeTab === 'dictionary' && styles.tabTextActive]}>
                📚 {translationLang === 'pt' ? 'Dicionário' : translationLang === 'es' ? 'Diccionario' : 'Dictionary'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === 'reader' ? renderReader() : renderDictionary()}
        </>
      )}

      {/* Sidebar overlay e Dicionário Modal */}
      <ChapterSidebar />
      <TermBottomSheet />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAF5E4',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  header: {
    padding: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8DCC8',
  },
  headerNarrow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', // Evita colapso
  },
  headerLeftWide: {
    flex: 1,
    width: 'auto',
    marginRight: 12,
  },
  languageSelectorContainer: {
    marginLeft: 12,
  },
  languageSelectorContainerNarrow: {
    marginLeft: 0,
    marginTop: 12,
    alignSelf: 'center', // Fica perfeitamente no centro abaixo do título
    width: '100%',
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#4B2E2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: { color: '#FAF5E4', fontSize: 20 },
  titleBlock: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#4B2E2A' },
  titleTranslation: { fontSize: 12, color: '#8B7355', fontStyle: 'italic', marginTop: 1 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E8DCC8',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#4B2E2A' },
  tabText: { fontSize: 13, color: '#4B2E2A', fontWeight: '500' },
  tabTextActive: { color: '#FAF5E4', fontWeight: '700' },
  content: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#8B7355' },
  chapterNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8DCC8',
    backgroundColor: '#F5EDD8',
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4B2E2A',
  },
  navBtnDisabled: { backgroundColor: '#D4C8B0', opacity: 0.5 },
  navBtnText: { color: '#FAF5E4', fontSize: 13, fontWeight: '600' },
  navBtnTextDisabled: { color: '#9A8A70' },
  navChapter: { fontSize: 13, color: '#8B7355', fontWeight: '600' },
  tabletSplitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tabletMainContent: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: '#E8DCC8',
  },
  tabletSideContent: {
    flex: 1,
    backgroundColor: '#FAF5E4',
  },
});

export default HomeScreen;
