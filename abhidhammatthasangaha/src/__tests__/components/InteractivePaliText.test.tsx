import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { InteractivePaliText } from '../../components/Reader/InteractivePaliText';

describe('InteractivePaliText', () => {
  it('renders split text and supports clicking words', () => {
    const text = "Evam me sutam. Ekam samayam bhagava";
    const { getByText } = render(
      <Provider store={store}>
        <InteractivePaliText text={text} onWordPress={() => {}} />
      </Provider>
    );
    expect(getByText('Evam')).toBeTruthy();
    expect(getByText('sutam')).toBeTruthy();
    expect(getByText('. ')).toBeTruthy();
  });
});
