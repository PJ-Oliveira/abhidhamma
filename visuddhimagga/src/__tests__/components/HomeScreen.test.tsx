import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import readingReducer from '../../store/slices/readingSlice';
import settingsReducer from '../../store/slices/settingsSlice';
import HomeScreen from '../../components/HomeScreen';

// Resolve Jest dynamic import bug by mocking textSearch
jest.mock('../../services/textSearch', () => ({
  buildSearchIndex: jest.fn().mockResolvedValue(undefined),
  searchSegments: jest.fn().mockReturnValue([]),
  highlightMatch: jest.fn((text) => text),
}));

describe('HomeScreen Responsiveness', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        reading: readingReducer,
        settings: settingsReducer,
      },
      preloadedState: {
        settings: { fontSize: 16 }
      }
    });
  });

  it('renders correctly on a narrow screen without crashing', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    // O título do primeiro capítulo do livro (esperado carregar assíncronamente)
    expect(await findByText(/Sīla-niddesa/i)).toBeTruthy();
  });
});
