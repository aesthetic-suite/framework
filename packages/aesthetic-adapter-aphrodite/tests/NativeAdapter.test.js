/* eslint-disable sort-keys */

import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import AphroditeAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_DESCENDANT,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';
import { renderAphroditeStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-aphrodite/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAdapter();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('can customize the aphrodite instance through the constructor', () => {
    const extension = { selectorHandler() {} };
    instance = new AphroditeAdapter([extension]);

    expect(instance.aphrodite).not.toEqual(StyleSheet);
  });

  it('can transform dynamic styles', () => {
    expect(instance.transform({
      width: 10,
      height: 10,
    })).toBe('0_7in6ye');
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_NATIVE_PARTIAL).button))
      .toBe('button_13l44zh');
  });

  it('combines different style declarations into unique class names', () => {
    const sheet = instance.create({
      foo: {
        color: 'red',
        display: 'block',
      },
      bar: {
        color: 'green',
        margin: 5,
      },
      baz: {
        color: 'blue',
        padding: 5,
      },
    });

    expect(instance.transform(sheet.foo)).toBe('foo_1u9pmmq');
    expect(instance.transform(sheet.bar)).toBe('bar_1etchdu');
    expect(instance.transform(sheet.baz)).toBe('baz_xw1a2w');
    expect(instance.transform(sheet.foo, sheet.baz))
      .toBe('foo_1u9pmmq-o_O-baz_xw1a2w');
    expect(instance.transform(sheet.bar, sheet.foo))
      .toBe('bar_1etchdu-o_O-foo_1u9pmmq');
  });

  it('handles globals', () => {
    instance.transform(instance.create({
      globals: {
        '*body': { margin: 0 },
        '*html': { height: '100%' },
        '*a': {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      },
    }).globals);

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles pseudo selectors', () => {
    expect(instance.transform(instance.create(SYNTAX_PSEUDO).pseudo)).toBe('pseudo_q2zd6k');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles descendant selectors', () => {
    expect(instance.transform(instance.create(SYNTAX_DESCENDANT).list)).toBe('list_1lo5lhe');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    expect(instance.transform(instance.create({
      font: {
        fontFamily: [FONT_ROBOTO_FLAT_SRC],
        fontSize: 20,
      },
    }).font)).toBe('font_uk6a9p');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    expect(instance.transform(instance.create({
      animation: {
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
        animationName: KEYFRAME_FADE,
      },
    }).animation)).toBe('animation_mab5hn');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles media queries', () => {
    expect(instance.transform(instance.create({
      media: {
        color: 'red',
        '@media (min-width: 300px)': {
          color: 'blue',
        },
        '@media (max-width: 1000px)': {
          color: 'green',
        },
      },
    }).media)).toBe('media_1yqe7pa');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });
});
