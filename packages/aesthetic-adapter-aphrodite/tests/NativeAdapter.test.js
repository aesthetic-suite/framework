/* eslint-disable sort-keys */

import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import { flushToString } from 'aphrodite/lib/inject';
import AphroditeAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

describe('aesthetic-adapter-aphrodite/NativeAdapter', () => {
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
      button: 'button_13l44zh',
    });
  });

  it('handles pseudos', () => {
    expect(instance.transform('component', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'pseudo_q2zd6k',
    });

    expect(flushToString())
      .toBe('.pseudo_q2zd6k{position:fixed !important;}.pseudo_q2zd6k:hover{position:static !important;}.pseudo_q2zd6k::before{position:absolute !important;}');
  });

  it('handles font faces', () => {
    const nativeSyntax = {
      font: {
        fontFamily: FONT_ROBOTO_FLAT_SRC,
        fontSize: 20,
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      font: 'font_nxcmiz',
    });

    expect(flushToString())
      .toBe("@font-face{font-family:Roboto;font-style:normal;font-weight:normal;src:url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype');}.font_nxcmiz{font-family:\"undefined\" !important;font-size:20px !important;}");
  });

  it('handles animations', () => {
    const nativeSyntax = {
      animation: {
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
        animationName: KEYFRAME_FADE,
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      animation: 'animation_mab5hn',
    });

    expect(flushToString())
      .toBe('@keyframes keyframe_18jn58a{from{opacity:0;}to{opacity:1;}}.animation_mab5hn{-webkit-animation-duration:3s, 1200ms !important;animation-duration:3s, 1200ms !important;-webkit-animation-iteration-count:infinite !important;animation-iteration-count:infinite !important;-webkit-animation-name:keyframe_18jn58a !important;animation-name:keyframe_18jn58a !important;}');
  });

  it('handles media queries', () => {
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
      media: 'media_1yqe7pa',
    });

    expect(flushToString())
      .toBe('.media_1yqe7pa{color:red !important;}@media (min-width: 300px){.media_1yqe7pa{color:blue !important;}}@media (max-width: 1000px){.media_1yqe7pa{color:green !important;}}');
  });
});
