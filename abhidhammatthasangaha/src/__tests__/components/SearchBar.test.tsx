import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import readingReducer from '../../store/slices/readingSlice';
import { SearchBar } from '../../components/SearchBar/SearchBar';

jest.mock('../../services/textSearch', () => ({
  searchSegments: jest.fn().mockReturnValue(['vism-1']),
}));

describe('SearchBar Component', () => {
  it('updates input and triggers search', () => {
    const store = configureStore({ reducer: { reading: readingReducer } });
    const { getByPlaceholderText, getByRole } = render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = getByPlaceholderText(/Search/i);
    fireEvent.changeText(input, 'dhamma');
    
    // Testa o clique no ícone
    const btn = getByRole('button', { name: 'Search' });
    fireEvent.press(btn);
  });
});
