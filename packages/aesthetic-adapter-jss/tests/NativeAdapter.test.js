/* eslint-disable sort-keys */

import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';
import { renderJSSStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-jss/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAdapter(jss);
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).toBe(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_NATIVE_PARTIAL).button)).toBe('button-0-3-1');
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

    expect(instance.transform(sheet.foo)).toBe('foo-0-4-1');
    expect(instance.transform(sheet.bar)).toBe('bar-0-4-2');
    expect(instance.transform(sheet.baz)).toBe('baz-0-4-3');
    expect(instance.transform(sheet.foo, sheet.baz))
      .toBe('foo-0-4-1 baz-0-4-3');
    expect(instance.transform(sheet.bar, sheet.foo))
      .toBe('bar-0-4-2 foo-0-4-1');
  });

  it('handles pseudos', () => {
    expect(instance.transform(instance.create({
      pseudo: {
        position: 'fixed',
        '&:hover': {
          position: 'static',
        },
        '&::before': {
          position: 'absolute',
        },
      },
    }).pseudo)).toBe('pseudo-0-5-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    expect(instance.transform(instance.create({
      fallback: {
        background: 'red',
        display: 'flex',
        fallbacks: [
          { background: 'linear-gradient(...)' },
          { display: 'flex-box' },
          { display: 'box' },
        ],
      },
    }).fallback)).toBe('fallback-0-6-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    expect(instance.transform(instance.create({
      '@font-face': FONT_ROBOTO_FLAT_SRC,
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    }).font)).toBe('font-0-7-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    expect(instance.transform(instance.create({
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    }).animation)).toBe('animation-0-8-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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
    }).media)).toBe('media-0-9-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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
    }).sup)).toBe('sup-0-10-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('prefixes class names with style name', () => {
    expect(instance.transform(instance.create(SYNTAX_NATIVE_PARTIAL, 'prefix').button))
      .toBe('prefix-button-0-11-1');
  });

  it('can transform dynamic styles', () => {
    expect(instance.transform({
      width: 10,
      height: 10,
    })).toBe('inline-0-0-12-1');
  });
});
