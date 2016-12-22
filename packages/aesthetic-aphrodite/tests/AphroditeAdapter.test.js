import { expect } from 'chai';
import { StyleSheet } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import AphroditeAdapter from '../src/AphroditeAdapter';

describe('AphroditeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new AphroditeAdapter();
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
    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })).to.deep.equal({
      button: 'button_sejigo',
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
          _definition: {
            display: 'inline-block',
            padding: 5,
          },
          _name: 'button_sejigo',
        },
        buttonGroup: {
          _definition: {
            display: 'flex',
          },
          _name: 'buttonGroup_poyjc',
        },
      },
      classNames: {
        button: 'button_sejigo',
        buttonGroup: 'buttonGroup_poyjc',
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
          _definition: {
            ':hover': {
              position: 'static',
            },
            '::before': {
              position: 'absolute',
            },
            position: 'fixed',
          },
          _name: 'foo_1217cca',
        },
      },
      classNames: {
        foo: 'foo_1217cca',
      },
    });
  });

  it('supports animations', () => {
    const translateKeyframes = {
      '0%': { transform: 'translateX(0)' },
      '50%': { transform: 'translateX(100px)' },
      '100%': { transform: 'translateX(0)' },
    };

    const opacityKeyframes = {
      from: { opacity: 0 },
      to: { opacity: 1 },
    };

    instance.transform('foo', {
      foo: {
        animationName: [translateKeyframes, opacityKeyframes],
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        foo: {
          _definition: {
            animationName: [translateKeyframes, opacityKeyframes],
            animationDuration: '3s, 1200ms',
            animationIterationCount: 'infinite',
          },
          _name: 'foo_1lseykp',
        },
      },
      classNames: {
        foo: 'foo_1lseykp',
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
          _definition: {
            color: 'red',
            '@media(min-width: 300px)': {
              color: 'blue',
            },
          },
          _name: 'foo_13ib8xx',
        },
      },
      classNames: {
        foo: 'foo_13ib8xx',
      },
    });
  });
});
