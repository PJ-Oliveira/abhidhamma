import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { Reader } from '../../components/Reader/Reader';

describe('Reader UI', () => {
  it('renders correctly and handles empty state', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Reader segments={[]} />
      </Provider>
    );
    expect(getByText(/Nenhum segmento neste capítulo/i)).toBeTruthy();
  });
});
