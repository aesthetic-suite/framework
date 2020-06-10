import React from 'react';
import { render } from 'rut-dom';
import { aesthetic } from '@aesthetic/core';
import {
  setupAesthetic,
  teardownAesthetic,
  darkTheme,
  lightTheme,
} from '@aesthetic/core/lib/testing';
import useTheme from '../src/useTheme';
import ThemeProvider from '../src/ThemeProvider';

describe('useTheme()', () => {
  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  it('errors if no context provided', () => {
    function Component() {
      useTheme();

      return null;
    }

    expect(() => {
      render<{}>(<Component />);
    }).toThrow('Theme has not been provided.');
  });

  it('returns a preferred theme if no name provided', () => {
    // @ts-expect-error Only need to mock matches
    window.matchMedia = () => ({ matches: false });

    let theme;

    function Component() {
      theme = useTheme();

      return null;
    }

    render<{}>(
      <ThemeProvider>
        <Component />
      </ThemeProvider>,
    );

    expect(theme).toEqual(lightTheme);
  });

  it('returns the theme defined by the provider', () => {
    let theme;

    function Component() {
      theme = useTheme();

      return null;
    }

    render<{}>(
      <ThemeProvider name="night">
        <Component />
      </ThemeProvider>,
    );

    expect(theme).toEqual(darkTheme);
  });
});
