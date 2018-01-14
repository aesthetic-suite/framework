/* eslint-disable sort-keys */

import { fontFace, keyframes } from 'typestyle';
import TypeStyleAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';
import { renderTSStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-typestyle/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new TypeStyleAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_NATIVE_PARTIAL).button)).toBe('f7tlree');
  });

  it('can transform dynamic styles', () => {
    expect(instance.transform({
      width: 10,
      height: 10,
    })).toBe('fe13ew7');

    expect(renderTSStyles(instance)).toMatchSnapshot();
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

    expect(instance.transform(sheet.foo)).toBe('fi2v7vn');
    expect(instance.transform(sheet.bar)).toBe('f13zjou3');
    expect(instance.transform(sheet.baz)).toBe('fv7opsh');
    expect(instance.transform(sheet.foo, sheet.baz)).toBe('f2xyygz');
    expect(instance.transform(sheet.bar, sheet.foo)).toBe('f14rya1t');
  });

  it('handles attribute selectors', () => {
    expect(instance.transform(instance.create({
      attr: {
        display: 'block',
        $nest: {
          '&[disabled]': {
            opacity: 0.5,
          },
        },
      },
    }).attr)).toBe('f14zstro');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles descendant selectors', () => {
    expect(instance.transform(instance.create({
      list: {
        margin: 0,
        padding: 0,
        $nest: {
          '&> li': {
            listStyle: 'bullet',
          },
        },
      },
    }).list)).toBe('f1qve63s');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles pseudo selectors', () => {
    expect(instance.transform(instance.create({
      pseudo: {
        position: 'fixed',
        $nest: {
          '&:hover': {
            position: 'static',
          },
          '&::before': {
            position: 'absolute',
          },
        },
      },
    }).pseudo)).toBe('fmow1iy');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    expect(instance.transform(instance.create({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    }).fallback)).toBe('fxr1ybm');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    fontFace(FONT_ROBOTO_FLAT_SRC); // No return

    expect(instance.transform(instance.create({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    }).font)).toBe('fd14wa4');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    expect(instance.transform(instance.create({
      animation: {
        animationName: keyframes(KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    }).animation)).toBe('f14e9xg1');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles media queries', () => {
    expect(instance.transform(instance.create({
      media: {
        color: 'red',
        $nest: {
          '@media (min-width: 300px)': {
            color: 'blue',
          },
          '@media (max-width: 1000px)': {
            color: 'green',
          },
        },
      },
    }).media)).toBe('fuxmg1k');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles supports', () => {
    expect(instance.transform(instance.create({
      sup: {
        display: 'block',
        $nest: {
          '@supports (display: flex)': {
            display: 'flex',
          },
          '@supports not (display: flex)': {
            float: 'left',
          },
        },
      },
    }).sup)).toBe('f6m6wzj');

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });
});
