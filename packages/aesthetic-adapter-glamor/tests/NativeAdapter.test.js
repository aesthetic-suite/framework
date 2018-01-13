/* eslint-disable sort-keys */

import { css, speedy, flush } from 'glamor';
import GlamorAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_DESCENDANT,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';
import { renderGlamorStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-glamor/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new GlamorAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_NATIVE_PARTIAL).button)).toBe('css-1n8n9n3');
  });

  it('can transform dynamic styles', () => {
    expect(instance.transform({
      width: 10,
      height: 10,
    })).toBe('css-s3feo0');
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

    expect(instance.transform(sheet.foo)).toBe('css-1r6w0zj');
    expect(instance.transform(sheet.bar)).toBe('css-otvq3e');
    expect(instance.transform(sheet.baz)).toBe('css-1s3i2b7');
    expect(instance.transform(sheet.foo, sheet.baz)).toBe('css-1pp6oml');
    expect(instance.transform(sheet.bar, sheet.foo)).toBe('css-h4vsx0');
  });

  it('handles pseudo selectors', () => {
    expect(instance.transform(instance.create(SYNTAX_PSEUDO).pseudo)).toBe('css-1g7aevf');

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles descendant selectors', () => {
    expect(instance.transform(instance.create({
      list: {
        margin: 0,
        padding: 0,
        '& > li': {
          listStyle: 'bullet',
        },
      },
    }).list)).toBe('css-191gc4j');

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    expect(instance.transform(instance.create({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    }).fallback)).toBe('css-1nxkcks');

    // Verified it ran but fallbacks don't appear in the output
    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    css.fontFace(FONT_ROBOTO_FLAT_SRC);

    expect(instance.transform(instance.create({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    }).font)).toBe('css-1x6s9dk');

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    expect(instance.transform(instance.create({
      animation: {
        animationName: css.keyframes('fade', KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    }).animation)).toBe('css-s8bawe');

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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
    }).media)).toBe('css-rr71yy');

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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
    }).sup)).toBe('css-1sp1mbh');

    // Verified it ran but supports don't appear in the output
    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });
});
