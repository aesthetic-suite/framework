import { expect } from 'chai';
import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import AphroditeAdapter from '../src/UnifiedAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_FULL,
  SYNTAX_AT_RULES,
  SYNTAX_PSEUDO,
  SYNTAX_FONT_FACE,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
} from '../../../tests/mocks';

describe('UnifiedAphroditeAdapter', () => {
  let instance;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAdapter(StyleSheet);
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_FULL)).to.deep.equal({
      button: 'button_1jj865m',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.convert('component', SYNTAX_FULL)).to.deep.equal({
      button: {
        margin: 0,
        padding: '6px 12px',
        border: '1px solid #2e6da4',
        borderRadius: 4,
        display: 'inline-block',
        cursor: 'pointer',
        fontFamily: [FONT_ROBOTO],
        fontWeight: 'normal',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        textAlign: 'center',
        backgroundColor: '#337ab7',
        verticalAlign: 'middle',
        color: 'rgba(0, 0, 0, 0)',
        animationName: [KEYFRAME_FADE],
        animationDuration: '.3s',
        ':hover': {
          backgroundColor: '#286090',
          borderColor: '#204d74',
        },
        '::before': {
          content: '"★"',
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: 5,
        },
        '@media (max-width: 600px)': {
          padding: '4px 8px',
        },
      },
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
    expect(instance.convert('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: {
        fontFamily: [FONT_ROBOTO],
        fontSize: 20,
      },
    });

    instance.syntax.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: 'font_15i4tai',
    });
  });

  it('supports animations', () => {
    expect(instance.convert('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: {
        animationName: [KEYFRAME_FADE],
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.syntax.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: 'animation_18xr9w6',
    });
  });

  it('supports media queries', () => {
    expect(instance.convert('component', SYNTAX_MEDIA_QUERY)).to.deep.equal({
      media: {
        color: 'red',
        '@media (max-width: 1000px)': {
          color: 'green',
        },
        '@media (min-width: 300px)': {
          color: 'blue',
        },
      },
    });

    expect(instance.transform('component', SYNTAX_MEDIA_QUERY)).to.deep.equal({
      media: 'media_1dsrhwv',
    });
  });

});
