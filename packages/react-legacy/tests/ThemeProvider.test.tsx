/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import aesthetic from 'aesthetic';
import { setupAesthetic, teardownAesthetic } from 'aesthetic/lib/testing';
import ThemeProvider from '../src/ThemeProvider';
import { ThemeProviderProps } from '../src/types';

describe('ThemeProvider', () => {
  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
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

  it('calls `changeTheme` when `propagate` is true', () => {
    const spy = jest.spyOn(aesthetic, 'changeTheme');
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider propagate>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    update({
      name: 'dark',
    });

    expect(spy).toHaveBeenCalledWith('dark');

    spy.mockRestore();
  });

  it('doesnt call `changeTheme` when `propagate` is false', () => {
    const spy = jest.spyOn(aesthetic, 'changeTheme');
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider propagate>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    update({
      name: 'dark',
    });

    expect(spy).toHaveBeenCalledWith('dark');

    spy.mockRestore();
  });
});
