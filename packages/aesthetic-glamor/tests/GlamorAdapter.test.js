import { expect } from 'chai';
import { css, media, speedy, flush } from 'glamor';
import GlamorAdapter from '../src/GlamorAdapter';

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

  it('transforms style declarations into class names', () => {
    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
      buttonGroup: {
        display: 'flex',
      },
    })).to.deep.equal({
      button: 'foo-css-4czob7',
      buttonGroup: 'foo-css-1cqgl9p',
    });
  });

  it('handles an array of style declarations', () => {
    expect(instance.transform('foo', {
      foo: [
        { fontSize: 5 },
        { fontWeight: 'bold' },
        media('min-width: 300px)', {
          color: 'blue',
        }),
      ],
    })).to.deep.equal({
      foo: 'foo-css-q1djek',
    });
  });

  it('supports pseudos', () => {
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
  });

  it('supports font faces', () => {
    const font = css.fontFace({
      fontFamily: 'FontName',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('coolfont.woff2') format('woff2')",
    });

    expect(instance.transform('foo', {
      foo: {
        fontFamily: font,
        fontSize: 20,
      },
    })).to.deep.equal({
      foo: 'foo-css-1d41l2q',
    });
  });

  it('supports animations', () => {
    const translateKeyframes = css.keyframes({
      '0%': { transform: 'translateX(0)' },
      '50%': { transform: 'translateX(100px)' },
      '100%': { transform: 'translateX(0)' },
    });

    const opacityKeyframes = css.keyframes({
      from: { opacity: 0 },
      to: { opacity: 1 },
    });

    expect(instance.transform('foo', {
      foo: {
        animationName: `${translateKeyframes} ${opacityKeyframes}`,
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    })).to.deep.equal({
      foo: 'foo-css-tg6l64',
    });
  });

  it('supports media queries', () => {
    expect(instance.transform('foo', {
      foo: {
        color: 'red',
        '@media(min-width: 300px)': {
          color: 'blue',
        },
      },
    })).to.deep.equal({
      foo: 'foo-css-1qy1v7f',
    });
  });
});
