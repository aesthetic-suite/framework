/* eslint-disable sort-keys */

import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import FelaAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';
import { renderFelaStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-fela/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new FelaAdapter(createRenderer({
      plugins: [...webPreset],
    }));
  });

  it('can customize the fela instance through the constructor', () => {
    const renderer = createRenderer({ plugins: [] });
    const newInstance = new FelaAdapter(renderer);

    expect(newInstance.fela).not.toEqual(instance.fela);
  });

  it('can transform dynamic styles', () => {
    expect(instance.transform({
      width: 10,
      height: 10,
    })).toBe('a b');
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_NATIVE_PARTIAL).button))
      .toBe('a b c d e f g h i j k l m n o p q r s t u v w');
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

    expect(instance.transform(sheet.foo)).toBe('a b');
    expect(instance.transform(sheet.bar)).toBe('c d');
    expect(instance.transform(sheet.baz)).toBe('e f');
    expect(instance.transform(sheet.foo, sheet.baz))
      .toBe('e b f');
    expect(instance.transform(sheet.bar, sheet.foo))
      .toBe('a d b');
  });

  it('handles pseudos', () => {
    expect(instance.transform(instance.create(SYNTAX_PSEUDO).pseudo)).toBe('a b c');

    expect(renderFelaStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    expect(instance.transform(instance.create({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    }).fallback)).toBe('a b');

    expect(renderFelaStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    instance.fela.renderFont('Roboto', ['fonts/roboto.woff2'], FONT_ROBOTO_FLAT_SRC);

    expect(instance.transform(instance.create({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    }).font)).toBe('a b');

    expect(renderFelaStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    expect(instance.transform(instance.create({
      animation: {
        animationName: instance.fela.renderKeyframe(() => KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    }).animation)).toBe('a b c');

    expect(renderFelaStyles(instance)).toMatchSnapshot();
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
    }).media)).toBe('a b c');

    expect(renderFelaStyles(instance)).toMatchSnapshot();
  });

  it('handles supports', () => {
    expect(instance.transform(instance.create({
      sup: {
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
        '@supports not (display: flex)': {
          float: 'left',
        },
      },
    }).sup)).toBe('a b c');

    expect(renderFelaStyles(instance)).toMatchSnapshot();
  });
});
