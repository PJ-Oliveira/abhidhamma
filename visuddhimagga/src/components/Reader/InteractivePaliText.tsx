import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { setDictionaryWord } from '../../store/slices/readingSlice';
import { lookupWord } from '../../services/dictionaryService';

interface Props {
  text: string;
  style?: TextStyle | TextStyle[];
}

export const InteractivePaliText: React.FC<Props> = ({ text, style }) => {
  const dispatch = useAppDispatch();

  // Apenas memoriza a estrutura e a checagem no dicionário, separando do `style` que muda toda hora
  const parsedTokens = useMemo(() => {
    const tokens = text.split(/([^a-zA-ZāīūñṅṭḍṇḷṃĀĪŪÑṄṬḌṆḶṂ]+)/g);
    
    return tokens.map((token) => {
      if (!token) return null;
      const isPunctuationOrSpace = /^[^a-zA-ZāīūñṅṭḍṇḷṃĀĪŪÑṄṬḌṆḶṂ]+$/.test(token);
      if (isPunctuationOrSpace) {
        return { type: 'text', text: token, isInteractive: false };
      }
      
      const entry = lookupWord(token);
      if (entry) {
        return { type: 'word', text: token, isInteractive: true, paliId: entry.pali };
      }
      return { type: 'word', text: token, isInteractive: false };
    }).filter(Boolean) as { type: string, text: string, isInteractive: boolean, paliId?: string }[];
  }, [text]);

  return (
    <Text style={[style, styles.paliFont]}>
      {parsedTokens.map((token, index) => {
        if (token.isInteractive) {
          return (
            <Text 
              key={index} 
              style={[styles.interactiveWord]} 
              onPress={() => dispatch(setDictionaryWord(token.paliId!))}
            >
              {token.text}
            </Text>
          );
        }
        return <Text key={index}>{token.text}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  paliFont: {
    fontFamily: 'NotoSerif_400Regular', // Fonte Acadêmica VSM
  },
  interactiveWord: {
    color: '#654321', // Um marrom escuro sutil para indicar interatividade
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(101, 67, 33, 0.4)',
    textDecorationStyle: 'dotted',
  }
});
