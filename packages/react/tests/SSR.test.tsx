/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { aesthetic, LocalSheet, SheetStructure } from '@aesthetic/core';
import { ServerRenderer } from '@aesthetic/style';
import { setupAesthetic, teardownAesthetic, purgeStyles } from '@aesthetic/core/src/testing';
import { useStyles, ThemeProvider } from '../src';
import { createStyleSheet, ButtonProps } from './__mocks__/Button';

describe('SSR', () => {
  let renderer: ServerRenderer;
  let sheet: LocalSheet<SheetStructure<
    'button' | 'button_block' | 'button_disabled' | 'button_large' | 'button_small'
  >>;

  function Button({ children, block, disabled, large, small }: ButtonProps) {
    const cx = useStyles(sheet);

    return (
      <button
        type="button"
        className={cx(
          'button',
          block && 'button_block',
          disabled && 'button_disabled',
          large && 'button_large',
          small && 'button_small',
        )}
      >
        {children}
      </button>
    );
  }

  function App() {
    return (
      <ThemeProvider name="night">
        <main>
          <div>You are not logged in!</div>
          <Button href="/login">Login</Button>
          <Button href="/register">Register</Button>
        </main>
      </ThemeProvider>
    );
  }

  beforeEach(() => {
    renderer = new ServerRenderer();
    sheet = createStyleSheet();

    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);

    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');

    delete global.AESTHETIC_SSR_CLIENT;
  });

  describe('renderToString()', () => {
    it('renders markup', () => {
      expect(renderToString(renderer.captureStyles(<App />))).toMatchSnapshot();
      expect(renderer.renderToStyleMarkup()).toMatchSnapshot();
    });
  });

  describe('renderToStaticMarkup()', () => {
    it('renders markup', () => {
      expect(renderToStaticMarkup(renderer.captureStyles(<App />))).toMatchSnapshot();
      expect(renderer.renderToStyleMarkup()).toMatchSnapshot();
    });
  });
});