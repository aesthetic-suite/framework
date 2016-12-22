import { expect } from 'chai';
import { create } from 'jss';
import JSSAdapter from '../src/JSSAdapter';

describe('JSSAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new JSSAdapter();
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).to.equal(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })).to.deep.equal({
      button: 'button-1157032238',
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

    expect(instance.sheets.foo.classNames).to.deep.equal({
      button: 'button-1157032238',
      buttonGroup: 'buttonGroup-4078521147',
    });
  });

  it.skip('handles an array of style declarations', () => {
    // JSS does not support this
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

    expect(instance.sheets.foo.classNames).to.deep.equal({
      foo: 'foo-2797810533',
    });
  });

  it('supports font faces', () => {
    const font = {
      fontFamily: 'FontName',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('coolfont.woff2') format('woff2')",
    };

    instance.transform('foo', {
      '@font-face': font,
      foo: {
        fontFamily: 'FontName',
        fontSize: 20,
      },
    });

    expect(instance.sheets.foo.classNames).to.deep.equal({
      foo: 'foo-1066392687',
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
      '@keyframes translate-anim': translateKeyframes,
      '@keyframes opacity-anim': opacityKeyframes,
      foo: {
        animationName: 'translate-anim opacity-anim',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.sheets.foo.classNames).to.deep.equal({
      foo: 'foo-4066947442',
    });
  });

  it('supports media queries', () => {
    instance.transform('foo', {
      foo: {
        color: 'red',
      },
      '@media(min-width: 300px)': {
        foo: {
          color: 'blue',
        },
      },
    });

    expect(instance.sheets.foo.classNames).to.deep.equal({
      foo: 'foo-3645560457',
    });
  });
});
