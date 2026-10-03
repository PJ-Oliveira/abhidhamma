import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../../store/slices/settingsSlice';
import SettingsScreen from '../../components/SettingsScreen';

describe('SettingsScreen Component', () => {
  it('renders correctly', () => {
    const store = configureStore({ reducer: { settings: settingsReducer }, preloadedState: { settings: { fontSize: 16 } } });
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen />
      </Provider>
    );

    expect(getByText(/Configurações/i)).toBeTruthy();
  });
});
