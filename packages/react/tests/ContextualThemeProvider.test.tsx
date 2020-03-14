/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { getTheme, renderThemeStyles } from '@aesthetic/core';
import { lightTheme, darkTheme } from '@aesthetic/core/src/testing';
import ContextualThemeProvider from '../src/ContextualThemeProvider';
import { ThemeProviderProps, DirectionProviderProps } from '../src/types';
import useTheme from '../src/useTheme';
import DirectionProvider from '../src/DirectionProvider';

jest.mock('@aesthetic/core');

describe('ContextualThemeProvider', () => {
  beforeEach(() => {
    lightTheme.name = 'day';
    darkTheme.name = 'night';

    (getTheme as jest.Mock).mockImplementation(name => (name === 'day' ? lightTheme : darkTheme));
    (renderThemeStyles as jest.Mock).mockImplementation(theme => `theme-${theme.name}`);
  });

  afterEach(() => {
    lightTheme.name = '';
    darkTheme.name = '';
  });

  it('renders children', () => {
    const { root } = render<ThemeProviderProps>(
      <ContextualThemeProvider name="night">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ContextualThemeProvider>,
    );

    expect(root.find('div')).toHaveLength(4);
  });

  it('doesnt re-render children if props never change', () => {
    let count = 0;

    function Child() {
      count += 1;

      return null;
    }

    const { update } = render<ThemeProviderProps>(
      <ContextualThemeProvider name="day">
        <Child />
      </ContextualThemeProvider>,
    );

    update();
    update();
    update();

    expect(count).toBe(1);
  });

  it('provides explicit theme by name', () => {
    expect.assertions(1);

    function Test() {
      const theme = useTheme();

      expect(theme).toBe(darkTheme);

      return null;
    }

    render<ThemeProviderProps>(
      <ContextualThemeProvider name="night">
        <Test />
      </ContextualThemeProvider>,
    );
  });

  it('wraps in a div with a class name and data attribute', () => {
    const { root } = render<ThemeProviderProps>(
      <ContextualThemeProvider name="night">
        <span />
      </ContextualThemeProvider>,
    );
    const wrapper = root.findOne('div');

    expect(wrapper).toHaveProp('className', 'theme-night');
    // @ts-ignore Data props not typed
    expect(wrapper).toHaveProp('data-theme', 'night');
  });

  it('re-renders theme styles if `name` changes', () => {
    const { rerender } = render<ThemeProviderProps>(
      <ContextualThemeProvider name="night">
        <div />
      </ContextualThemeProvider>,
    );

    rerender(
      <ContextualThemeProvider name="day">
        <div />
      </ContextualThemeProvider>,
    );

    expect(renderThemeStyles).toHaveBeenCalledWith(darkTheme, { direction: 'ltr' }); // Initial
    expect(renderThemeStyles).toHaveBeenCalledWith(lightTheme, { direction: 'ltr' }); // Rerender
  });

  it('re-renders theme styles if direction changes', () => {
    const { rerender } = render<DirectionProviderProps>(
      <DirectionProvider direction="ltr">
        <ContextualThemeProvider name="night">
          <div />
        </ContextualThemeProvider>
      </DirectionProvider>,
    );

    rerender(
      <DirectionProvider direction="rtl">
        <ContextualThemeProvider name="night">
          <div />
        </ContextualThemeProvider>
      </DirectionProvider>,
    );

    expect(renderThemeStyles).toHaveBeenCalledWith(darkTheme, { direction: 'ltr' }); // Initial
    expect(renderThemeStyles).toHaveBeenCalledWith(darkTheme, { direction: 'rtl' }); // Rerender
  });
});
