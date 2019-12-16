import React from 'react';
import { render } from 'rut-dom';
import aesthetic from 'aesthetic';
import { setupAesthetic, teardownAesthetic } from 'aesthetic/lib/testing';
import useTheme from '../src/useTheme';
import ThemeProvider from '../src/ThemeProvider';

describe('useTheme()', () => {
  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  it('returns the theme object', () => {
    let theme;

    function Component() {
      theme = useTheme();

      return null;
    }

    render<{}>(<Component />);

    expect(theme).toEqual({ bg: 'gray', color: 'black', unit: 8 });
  });

  it('returns the theme defined by the provider', () => {
    let theme;

    function Component() {
      theme = useTheme();

      return null;
    }

    render<{}>(
      <ThemeProvider name="dark">
        <Component />
      </ThemeProvider>,
    );

    expect(theme).toEqual({ bg: 'black', color: 'white', unit: 8 });
  });
});
