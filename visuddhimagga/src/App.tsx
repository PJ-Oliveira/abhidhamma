import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { RootNavigator } from './navigation/RootNavigator';
import * as Font from 'expo-font';
import { NotoSerif_400Regular, NotoSerif_700Bold, NotoSerif_400Regular_Italic } from '@expo-google-fonts/noto-serif';
import './i18n';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          NotoSerif_400Regular,
          NotoSerif_700Bold,
          NotoSerif_400Regular_Italic,
        });
      } catch (e) {
        console.warn("Erro carregando a fonte:", e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF5E4' }}>
        <ActivityIndicator size="large" color="#4B2E2A" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <RootNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
