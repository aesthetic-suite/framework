/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { TestAesthetic, registerTestTheme, TestTheme } from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
import { DirectionProviderProps } from '../src/types';

describe('DirectionProvider', () => {
  let aesthetic: TestAesthetic<TestTheme>;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    aesthetic.options.theme = 'light';

    registerTestTheme(aesthetic);
  });

  it('renders a `div` by default', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic}>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.find('div')).toHaveLength(1);
  });

  it('renders a `span` when `inline`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic} inline>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.find('span')).toHaveLength(1);
  });

  it('renders `ltr` explicitly with `dir`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic} dir="ltr">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'ltr');
  });

  it('renders `rtl` explicitly with `dir`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic} dir="rtl">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });

  it('renders `dir` over `value`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic} dir="rtl" value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });

  it('infers `ltr` from `value`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic} value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'ltr');
  });

  it('infers `rtl` from `value`', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic} value="بسيطة">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });

  it('infers `ltr` from `Aesthetic` instance', () => {
    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic}>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'ltr');
  });

  it('infers `rtl` from `Aesthetic` instance', () => {
    aesthetic.options.rtl = true;

    const { root } = render<DirectionProviderProps>(
      <DirectionProvider aesthetic={aesthetic}>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(root.findOne('div')).toHaveProp('dir', 'rtl');
  });
});
