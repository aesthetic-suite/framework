/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import aesthetic from 'aesthetic';
import { setupAesthetic, teardownAesthetic } from 'aesthetic/lib/testing';
import DirectionProvider from '../src/DirectionProvider';
import { DirectionProviderProps } from '../src/types';

describe('DirectionProvider', () => {
  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  it('renders a `div` by default', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.find('div')).toHaveLength(1);
  });

  it('renders a `span` when `inline`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider inline>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.find('span')).toHaveLength(1);
  });

  it('renders `ltr` explicitly with `dir`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider dir="ltr">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'ltr');
  });

  it('renders `rtl` explicitly with `dir`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider dir="rtl">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });

  it('renders `dir` over `value`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider dir="rtl" value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });

  it('infers `ltr` from `value`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'ltr');
  });

  it('infers `rtl` from `value`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider value="بسيطة">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });

  it('infers `ltr` from `Aesthetic` instance', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'ltr');
  });

  it('infers `rtl` from `Aesthetic` instance', () => {
    aesthetic.configure({ rtl: true });

    const { root } = render<DirectionProviderProps>(
      <DirectionProvider>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });
});
