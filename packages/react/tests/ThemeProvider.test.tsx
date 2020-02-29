/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { changeTheme } from '@aesthetic/core';
import { setupAesthetic, teardownAesthetic } from '@aesthetic/core/lib/testing';
import ThemeProvider from '../src/ThemeProvider';
import { ThemeProviderProps } from '../src/types';

jest.mock('@aesthetic/core');

describe('ThemeProvider', () => {
  beforeEach(() => {
    setupAesthetic();
  });

  afterEach(() => {
    teardownAesthetic();
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

  it('calls `changeTheme` when `name` changes', () => {
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    update({
      name: 'dark',
    });

    expect(changeTheme).toHaveBeenCalledWith('dark');
  });
});
