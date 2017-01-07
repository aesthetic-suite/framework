import { expect } from 'chai';
import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import AphroditeAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_FULL,
  SYNTAX_AT_RULES,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

describe('AphroditeAdapter', () => {
  let instance;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAdapter(StyleSheet);
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('can customize the aphrodite instance through the constructor', () => {
    const extension = { selectorHandler() {} };
    instance = new AphroditeAdapter(StyleSheet.extend([extension]));

    expect(instance.aphrodite).to.not.deep.equal(StyleSheet);
  });

  it('supports no important mode', () => {
    instance = new AphroditeAdapter(NoImpStyleSheet);

    expect(instance.aphrodite).to.not.deep.equal(StyleSheet);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_FULL)).to.deep.equal({
      button: 'button_1jj865m',
    });
  });

  it('allows standard at-rules', () => {
    expect(instance.convert('component', SYNTAX_AT_RULES)).to.deep.equal(SYNTAX_AT_RULES);
  });

  it('supports pseudos', () => {
    expect(instance.convert('component', SYNTAX_PSEUDO)).to.deep.equal(SYNTAX_PSEUDO);

    expect(instance.transform('component', SYNTAX_PSEUDO)).to.deep.equal({
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

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
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

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
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

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      media: 'media_1dsrhwv',
    });
  });
});
