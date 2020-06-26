/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { act } from 'react-test-renderer';
import {
  changeTheme,
  getActiveTheme,
  getTheme,
  renderThemeStyles,
  subscribe,
  unsubscribe,
  OnChangeTheme,
} from '@aesthetic/core';
import { lightTheme, darkTheme } from '@aesthetic/core/src/testing';
import ThemeProvider from '../src/ThemeProvider';
import { ThemeProviderProps } from '../src/types';
import useTheme from '../src/useTheme';

jest.mock('@aesthetic/core');

describe('ThemeProvider', () => {
  beforeEach(() => {
    // @ts-expect-error Only need to mock matches
    window.matchMedia = () => ({ matches: false });

    lightTheme.name = 'day';
    darkTheme.name = 'night';

    (getTheme as jest.Mock).mockImplementation((name) => (name === 'day' ? lightTheme : darkTheme));
    (getActiveTheme as jest.Mock).mockImplementation(() => lightTheme);
    (renderThemeStyles as jest.Mock).mockImplementation((theme) => `theme-${theme.name}`);
    (changeTheme as jest.Mock).mockReset();
    (subscribe as jest.Mock).mockReset();
    (unsubscribe as jest.Mock).mockReset();
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

    expect(changeTheme).toHaveBeenCalledWith('night', false);
  });

  describe('subscriptions', () => {
    it('subscribes on mount', () => {
      render<ThemeProviderProps>(
        <ThemeProvider>
          <div />
        </ThemeProvider>,
      );

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith('change:theme', expect.any(Function));
    });

    it('only subscribes once', () => {
      const { update } = render<ThemeProviderProps>(
        <ThemeProvider>
          <div />
        </ThemeProvider>,
      );

      update();
      update();
      update();

      expect(subscribe).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes on unmount', () => {
      const { unmount } = render<ThemeProviderProps>(
        <ThemeProvider>
          <div />
        </ThemeProvider>,
      );

      unmount();

      expect(unsubscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toHaveBeenCalledWith('change:theme', expect.any(Function));
    });

    it('changes them if outside `changeTheme` is called', () => {
      const themeSpy = jest.fn();
      let doChangeTheme: OnChangeTheme = () => {};

      // Janky, but since we mocked the module, we need to extract this
      (subscribe as jest.Mock).mockImplementation((name, cb) => {
        doChangeTheme = cb as OnChangeTheme;
      });

      function Comp() {
        themeSpy(useTheme());

        return null;
      }

      render<ThemeProviderProps>(
        <ThemeProvider name="day">
          <Comp />
        </ThemeProvider>,
      );

      // eslint-disable-next-line rut/no-act
      act(() => {
        doChangeTheme('night');
      });

      expect(themeSpy).toHaveBeenCalledWith(lightTheme);
      expect(themeSpy).toHaveBeenCalledWith(darkTheme);
    });
  });
});
