import { expect } from 'chai';
import { css, media, fontFace } from 'glamor';
import GlamorAdapter from '../src/GlamorAdapter';

describe('GlamorAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new GlamorAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })).to.deep.equal({
      button: 'foo-css-4czob7',
    });
  });

  it('caches transformed style sheets', () => {
    expect(instance.sheets.foo).to.be.an('undefined');

    instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
      buttonGroup: {
        display: 'flex',
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        button: {
          'data-css-4czob7': '',
        },
        buttonGroup: {
          'data-css-1cqgl9p': '',
        },
      },
      classNames: {
        button: 'foo-css-4czob7',
        buttonGroup: 'foo-css-1cqgl9p',
      },
    });
  });

  it('handles an array of style declarations', () => {
    instance.transform('foo', {
      foo: [
        { fontSize: 5 },
        { fontWeight: 'bold' },
        media('min-width: 300px)', {
          color: 'blue',
        }),
      ],
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        foo: {
          'data-css-q1djek': '',
        },
      },
      classNames: {
        foo: 'foo-css-q1djek',
      },
    });
  });

  it('supports pseudos', () => {
    instance.transform('foo', {
      foo: {
        position: 'fixed',
        ':hover': {
          position: 'static',
        },
        '::before': {
          position: 'absolute',
        },
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        foo: {
          'data-css-1g7aevf': '',
        },
      },
      classNames: {
        foo: 'foo-css-1g7aevf',
      },
    });
  });

  it('supports font faces', () => {
    const font = css.fontFace({
      fontFamily: 'FontName',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('coolfont.woff2') format('woff2')",
    });

    instance.transform('foo', {
      foo: {
        fontFamily: font,
        fontSize: 20,
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        foo: {
          'data-css-1d41l2q': '',
        },
      },
      classNames: {
        foo: 'foo-css-1d41l2q',
      },
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

    instance.transform('foo', {
      foo: {
        animationName: `${translateKeyframes} ${opacityKeyframes}`,
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        foo: {
          'data-css-tg6l64': '',
        },
      },
      classNames: {
        foo: 'foo-css-tg6l64',
      },
    });
  });

  it('supports media queries', () => {
    instance.transform('foo', {
      foo: {
        color: 'red',
        '@media(min-width: 300px)': {
          color: 'blue',
        },
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        foo: {
          'data-css-1qy1v7f': '',
        },
      },
      classNames: {
        foo: 'foo-css-1qy1v7f',
      },
    });
  });
});
