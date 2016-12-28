import { expect } from 'chai';
import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/JSSAdapter';
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

describe('JSSAdapter', () => {
  const style = createStyleTag('jss');
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAdapter(jss, { element: style });
    style.textContent = '';
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).to.equal(jss);
  });

  it('formats fallbacks correctly', () => {
    expect(instance.formatFallbacks({
      display: 'flex-box',
    })).to.deep.equal([
      { display: 'flex-box' },
    ]);

    expect(instance.formatFallbacks({
      display: ['box', 'flex-box'],
    })).to.deep.equal([
      { display: 'box' },
      { display: 'flex-box' },
    ]);

    expect(instance.formatFallbacks({
      background: 'red',
      display: ['box', 'flex-box'],
    })).to.deep.equal([
      { background: 'red' },
      { display: 'box' },
      { display: 'flex-box' },
    ]);
  });

  it('transforms style declarations into class names', (done) => {
    expect(instance.transform('foo', TEST_SYNTAX)).to.deep.equal({
      '.button-2458322340::before': '.button-2458322340::before-2875923937',
      '.button-2458322340:hover': '.button-2458322340:hover-4189501172',
      button: 'button-2458322340',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(syntaxOutput('button-2458322340', 'keyframe_cwjpzv'));
      done();
    }, 0);
  });

  it('supports unified pseudos', (done) => {
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
      '.foo-2058969816::before': '.foo-2058969816::before-410542997',
      '.foo-2058969816:hover': '.foo-2058969816:hover-2956313588',
      foo: 'foo-2058969816',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(pseudoOutput('foo-2058969816'));
      done();
    }, 0);
  });

  it('supports native pseudos', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        position: 'fixed',
        '&:hover': {
          position: 'static',
        },
        '&::before': {
          position: 'absolute',
        },
      },
    })).to.deep.equal({
      '.foo-2058969816::before': '.foo-2058969816::before-410542997',
      '.foo-2058969816:hover': '.foo-2058969816:hover-2956313588',
      foo: 'foo-2058969816',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(pseudoOutput('foo-2058969816'));
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
      foo: 'foo-285055133',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fontFaceOutput('foo-285055133'));
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
      foo: 'foo-3182640185',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(fontFaceOutput('foo-3182640185'));
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
      foo: 'foo-3574880963',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(keyframesOutput('foo-3574880963', 'keyframe_cwjpzv'));
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
      foo: 'foo-102957602',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(keyframesOutput('foo-102957602', 'keyframe_cwjpzv'));
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
      foo: 'foo-175683740',
    });

    setTimeout(() => {
      expect(style.textContent).to.be.css(mediaQueryOutput('foo-175683740'));
      done();
    }, 0);
  });

  it('supports native media queries', (done) => {
    instance.disableUnifiedSyntax();

    expect(instance.transform('foo', {
      foo: {
        color: 'red',
      },
      '@media (min-width: 300px)': {
        foo: {
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
