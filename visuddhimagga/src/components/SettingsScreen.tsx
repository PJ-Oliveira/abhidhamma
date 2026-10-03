// src/components/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Em breve: tamanho da fonte, tema, etc.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5E4' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4B2E2A', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8B7355' },
});

export default SettingsScreen;
