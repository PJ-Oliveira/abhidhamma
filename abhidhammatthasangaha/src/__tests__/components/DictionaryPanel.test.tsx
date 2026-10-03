import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import readingReducer from '../../store/slices/readingSlice';
import { DictionaryPanel } from '../../components/Dictionary/DictionaryPanel';

jest.mock('../../services/dictionaryService', () => ({
  searchDictionary: jest.fn().mockReturnValue([{
    pali: 'citta',
    grammar: 'noun',
    meaning: { en: 'mind', pt: 'mente', es: 'mente' }
  }]),
}));

describe('DictionaryPanel Component', () => {
  it('renders and allows typing', () => {
    const store = configureStore({ reducer: { reading: readingReducer } });
    const { getByPlaceholderText, getAllByText } = render(
      <Provider store={store}>
        <DictionaryPanel />
      </Provider>
    );

    const input = getByPlaceholderText(/Search Pali/i);
    fireEvent.changeText(input, 'cit');

    expect(getAllByText('citta')[0]).toBeTruthy();
  });
});
