import { expect } from 'chai';
import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import AphroditeAdapter from '../src/AphroditeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  TEST_SYNTAX,
  syntaxOutput,
  pseudoOutput,
  fontFaceOutput,
  keyframesOutput,
  mediaQueryOutput,
} from '../../../tests/mocks';

describe('AphroditeAdapter', () => {
  const style = createStyleTag('aphrodite');
  style.setAttribute('data-aphrodite', '');
  let instance;

  beforeEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    instance = new AphroditeAdapter(StyleSheet);
    style.textContent = '';
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

  it('converts unified syntax to native syntax', () => {
    expect(instance.convert('foo', TEST_SYNTAX)).to.deep.equal({
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

  it('transforms style declarations into class names', (done) => {
    expect(instance.transform('foo', TEST_SYNTAX)).to.deep.equal({
      button: 'button_1jj865m',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(syntaxOutput('button_1jj865m', 'keyframe_cwjpzv', true));
      done();
    }, 0);
  });

  it('supports pseudos', (done) => {
    expect(instance.transform('foo', {
      foo: {
        position: 'fixed',
        ':hover': {
          position: 'static',
        },
        '::before': {
          position: 'absolute',
        },
      },
    })).to.deep.equal({
      foo: 'foo_1217cca',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(pseudoOutput('foo_1217cca'));
      done();
    }, 0);
  });

  it.skip('supports unified fallbacks');

  it.skip('supports native fallbacks');

  it('supports unified font faces', (done) => {
    expect(instance.transform('foo', {
      '@font-face': {
        roboto: FONT_ROBOTO,
      },
      foo: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    })).to.deep.equal({
      foo: 'foo_15i4tai',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fontFaceOutput('foo_15i4tai'));
      done();
    }, 0);
  });

  it('supports native font faces', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        fontFamily: FONT_ROBOTO,
        fontSize: 20,
      },
    })).to.deep.equal({
      foo: 'foo_1myoopg',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fontFaceOutput('foo_1myoopg'));
      done();
    }, 0);
  });

  it('supports unified animations', (done) => {
    expect(instance.transform('foo', {
      '@keyframes': {
        fade: KEYFRAME_FADE,
      },
      foo: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    })).to.deep.equal({
      foo: 'foo_18xr9w6',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(keyframesOutput('foo_18xr9w6', 'keyframe_cwjpzv'));
      done();
    }, 0);
  });

  it('supports native animations', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        animationName: KEYFRAME_FADE,
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    })).to.deep.equal({
      foo: 'foo_2tm5yt',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(keyframesOutput('foo_2tm5yt', 'keyframe_cwjpzv'));
      done();
    }, 0);
  });

  it('supports unified media queries', (done) => {
    expect(instance.transform('foo', {
      foo: {
        color: 'red',
        '@media': {
          '(min-width: 300px)': {
            color: 'blue',
          },
        },
      },
    })).to.deep.equal({
      foo: 'foo_j4ta0n',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(mediaQueryOutput('foo_j4ta0n'));
      done();
    }, 0);
  });

  it('supports native media queries', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        color: 'red',
        '@media (min-width: 300px)': {
          color: 'blue',
        },
      },
    })).to.deep.equal({
      foo: 'foo_j4ta0n',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(mediaQueryOutput('foo_j4ta0n'));
      done();
    }, 0);
  });
});
