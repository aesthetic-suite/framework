import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import AphroditeAdapter from '../../../src/adapters/aphrodite/NativeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../mocks';

describe('adapters/aphrodite/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAdapter(StyleSheet);
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('errors for no React Native support', () => {
    instance.native = true;

    expect(() => instance.transform()).toThrowError('Aphrodite does not support React Native.');
  });

  it('can customize the aphrodite instance through the constructor', () => {
    const extension = { selectorHandler() {} };
    instance = new AphroditeAdapter(StyleSheet.extend([extension]));

    expect(instance.aphrodite).not.toEqual(StyleSheet);
  });

  it('supports no important mode', () => {
    instance = new AphroditeAdapter(NoImpStyleSheet);

    expect(instance.aphrodite).not.toEqual(StyleSheet);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'button_193hp5g',
    });
  });

  it('supports pseudos', () => {
    expect(instance.transform('component', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'pseudo_1217cca',
    });
  });

  it.skip('supports fallbacks');

  it('supports font faces', () => {
    const nativeSyntax = {
      font: {
        fontFamily: FONT_ROBOTO,
        fontSize: 20,
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      font: 'font_1myoopg',
    });
  });

  it('supports animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: KEYFRAME_FADE,
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      animation: 'animation_2tm5yt',
    });
  });

  it('supports media queries', () => {
    const nativeSyntax = {
      media: {
        color: 'red',
        '@media (min-width: 300px)': {
          color: 'blue',
        },
        '@media (max-width: 1000px)': {
          color: 'green',
        },
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      media: 'media_1dsrhwv',
    });
  });
});
