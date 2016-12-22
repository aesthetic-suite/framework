import { expect } from 'chai';
import { css } from 'glamor';
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
