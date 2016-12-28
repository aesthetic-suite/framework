import { expect } from 'chai';
import { speedy, flush } from 'glamor';
import GlamorAdapter from '../src/GlamorAdapter';
import {
  // FONT_ROBOTO,
  // KEYFRAME_FADE,
  TEST_SYNTAX,
  // syntaxOutput,
  // pseudoOutput,
  // fallbackOutput,
  // fontFaceOutput,
  // keyframesOutput,
  // mediaQueryOutput,
} from '../../../tests/mocks';

describe('GlamorAdapter', () => {
  let instance;
  let style;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new GlamorAdapter();
    style = global.document.querySelector('style:not([id])'); // Other tests have an ID

    if (style) {
      style.textContent = '';
    }
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
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        textAlign: 'center',
        backgroundColor: '#337ab7',
        verticalAlign: 'middle',
        color: ['#fff', 'rgba(0, 0, 0, 0)'],
        animationName: 'fade_1d92vx2',
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

  /*
  it('transforms style declarations into class names', (done) => {
    expect(instance.transform('foo', TEST_SYNTAX)).to.deep.equal({
      button: 'foo-css-3430r6',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(syntaxOutput('foo-css-3430r6', 'keyframe_cwjpzv'));
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
      foo: 'foo-css-1g7aevf',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(pseudoOutput('foo-css-1g7aevf'));
      done();
    }, 0);
  });

  it('supports unified fallbacks', (done) => {
    expect(instance.transform('foo', {
      foo: {
        position: 'flex',
        '@fallbacks': {
          position: 'flex-box',
        },
      },
    })).to.deep.equal({
      foo: 'foo-css-ia12l8',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fallbackOutput('foo-css-ia12l8'));
      done();
    }, 0);
  });

  it('supports native fallbacks', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        position: ['flex-box', 'flex'],
      },
    })).to.deep.equal({
      foo: 'foo-css-mp2mns',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fallbackOutput('foo-css-mp2mns'));
      done();
    }, 0);
  });

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
      foo: 'foo-css-1x6s9dk',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fontFaceOutput('foo-css-1x6s9dk'));
      done();
    }, 0);
  });

  it('supports native font faces', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        fontFamily: css.fontFace(FONT_ROBOTO),
        fontSize: 20,
      },
    })).to.deep.equal({
      foo: 'foo-css-1x6s9dk',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fontFaceOutput('foo-css-1x6s9dk'));
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
      foo: 'foo-css-1s7t11n',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(keyframesOutput('foo-css-1s7t11n', 'keyframe_cwjpzv'));
      done();
    }, 0);
  });

  it('supports native animations', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        animationName: css.keyframes(KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    })).to.deep.equal({
      foo: 'foo-css-bcj7v3',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(keyframesOutput('foo-css-bcj7v3', 'keyframe_cwjpzv'));
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
      foo: 'foo-css-ufwos3',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(mediaQueryOutput('foo-css-ufwos3'));
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
      foo: 'foo-css-ufwos3',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(mediaQueryOutput('foo-css-ufwos3'));
      done();
    }, 0);
  });
  */
});
