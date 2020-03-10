/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { changeTheme, getActiveTheme, getTheme, renderThemeStyles } from '@aesthetic/core';
import { lightTheme, darkTheme } from '@aesthetic/core/src/testing';
import ThemeProvider from '../src/ThemeProvider';
import { ThemeProviderProps } from '../src/types';
import useTheme from '../src/useTheme';

jest.mock('@aesthetic/core');

describe('ThemeProvider', () => {
  beforeEach(() => {
    // @ts-ignore Only need to mock matches
    window.matchMedia = () => ({ matches: false });

    lightTheme.name = 'day';
    darkTheme.name = 'night';

    (getTheme as jest.Mock).mockImplementation(name => (name === 'day' ? lightTheme : darkTheme));
    (getActiveTheme as jest.Mock).mockImplementation(() => lightTheme);
    (renderThemeStyles as jest.Mock).mockImplementation(theme => `theme-${theme.name}`);
    (changeTheme as jest.Mock).mockReset();
  });

  afterEach(() => {
    lightTheme.name = '';
    darkTheme.name = '';
  });

  it('renders children', () => {
    const { root } = render<ThemeProviderProps>(
      <ThemeProvider>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    expect(root.find('div')).toHaveLength(3);
  });

  it('doesnt wrap with a div when the root provider', () => {
    const { root } = render<ThemeProviderProps>(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );

    expect(root.find('div')).toHaveLength(0);
  });

  it('doesnt re-render children if props never change', () => {
    let count = 0;

    function Child() {
      count += 1;

      return null;
    }

    const { update } = render<ThemeProviderProps>(
      <ThemeProvider>
        <Child />
      </ThemeProvider>,
    );

    update();
    update();
    update();

    expect(count).toBe(1);
  });

  it('provides preferred or default theme', () => {
    expect.assertions(1);

    function Test() {
      const theme = useTheme();

      expect(theme).toBe(lightTheme);

      return null;
    }

    render<ThemeProviderProps>(
      <ThemeProvider>
        <Test />
      </ThemeProvider>,
    );
  });

  it('provides explicit theme by name', () => {
    expect.assertions(1);

    function Test() {
      const theme = useTheme();

      expect(theme).toBe(darkTheme);

      return null;
    }

    render<ThemeProviderProps>(
      <ThemeProvider name="night">
        <Test />
      </ThemeProvider>,
    );
  });

  it('calls `changeTheme` when `name` changes', () => {
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    update({
      name: 'night',
    });

    expect(changeTheme).toHaveBeenCalledWith('night');
  });

  describe('contextual', () => {
    function Outer() {
      const theme = useTheme();

      expect(theme).toBe(lightTheme);

      return null;
    }

    function Inner() {
      const theme = useTheme();

      expect(theme).toBe(darkTheme);

      return null;
    }

    it('renders and provides contextual themes', () => {
      expect.assertions(3);

      render<ThemeProviderProps>(
        <ThemeProvider>
          <Outer />
          <ThemeProvider name="night">
            <Inner />
          </ThemeProvider>
        </ThemeProvider>,
      );
    });

    it('errors if inner provider does not provide a `name`', () => {
      expect(() => {
        render<ThemeProviderProps>(
          <ThemeProvider>
            <Outer />
            <ThemeProvider>
              <Inner />
            </ThemeProvider>
          </ThemeProvider>,
        );
      }).toThrow(
        'Contextual themeing requires all nested `ThemeProvider`s to provide a `name` prop.',
      );
    });

    it('wraps contextual theme in a div with a class name and data attribute', () => {
      const { root } = render<ThemeProviderProps>(
        <ThemeProvider>
          <Outer />
          <ThemeProvider name="night">
            <Inner />
          </ThemeProvider>
        </ThemeProvider>,
      );
      const wrapper = root.findOne('div');

      expect(wrapper).toHaveProp('className', 'theme-night');
      // @ts-ignore Data props not typed
      expect(wrapper).toHaveProp('data-theme', 'night');
    });

    it('re-renders theme styles if inner `name` changes', () => {
      const { rerender } = render<ThemeProviderProps>(
        <ThemeProvider>
          <Outer />
          <ThemeProvider name="night">
            <div />
          </ThemeProvider>
        </ThemeProvider>,
      );

      rerender(
        <ThemeProvider>
          <Outer />
          <ThemeProvider name="day">
            <div />
          </ThemeProvider>
        </ThemeProvider>,
      );

      expect(renderThemeStyles).toHaveBeenCalledWith(darkTheme); // Initial
      expect(renderThemeStyles).toHaveBeenCalledWith(lightTheme); // Rerender
    });

    it('doesnt call `changeTheme` if inner `name` changes', () => {
      const { rerender } = render<ThemeProviderProps>(
        <ThemeProvider>
          <Outer />
          <ThemeProvider name="night">
            <div />
          </ThemeProvider>
        </ThemeProvider>,
      );

      rerender(
        <ThemeProvider>
          <Outer />
          <ThemeProvider name="day">
            <div />
          </ThemeProvider>
        </ThemeProvider>,
      );

      expect(changeTheme).not.toHaveBeenCalled();
    });

    it('only calls `changeTheme` once if outer `name` changes', () => {
      const { rerender } = render<ThemeProviderProps>(
        <ThemeProvider>
          <div />
          <ThemeProvider name="night">
            <div />
          </ThemeProvider>
        </ThemeProvider>,
      );

      rerender(
        <ThemeProvider name="night">
          <div />
          <ThemeProvider name="night">
            <div />
          </ThemeProvider>
        </ThemeProvider>,
      );

      expect(changeTheme).toHaveBeenCalledTimes(1);
    });
  });
});
