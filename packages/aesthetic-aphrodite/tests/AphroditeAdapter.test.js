import { expect } from 'chai';
import { StyleSheet } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import AphroditeAdapter from '../src/AphroditeAdapter';

describe('AphroditeAdapter', () => {
  const style = createStyleTag('aphrodite');
  style.setAttribute('data-aphrodite', '');
  let instance;

  beforeEach(() => {
    instance = new AphroditeAdapter();
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

  it('transforms style declarations into class names', (done) => {
    expect(instance.transform('foo', {
      button: {
        padding: 10,
        width: 'auto',
      },
      buttonGroup: {
        display: 'block',
      },
    })).to.deep.equal({
      button: 'button_1w7c38g',
      buttonGroup: 'buttonGroup_2jlos',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(
        '.button_1w7c38g{padding:10px !important;width:auto !important;}.buttonGroup_2jlos{display:block !important;}',
      );
      done();
    }, 0);
  });

  it.skip('handles an array of style declarations', (done) => {
     // Aphrodite does not support this feature
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
      expect(style.textContent).to.equal(
        '.foo_1217cca{position:fixed !important;}.foo_1217cca:hover{position:static !important;}.foo_1217cca::before{position:absolute !important;}',
      );
      done();
    }, 0);
  });

  it('supports font faces', (done) => {
    const font = {
      fontFamily: 'FontName',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('coolfont.woff2') format('woff2')",
    };

    expect(instance.transform('foo', {
      foo: {
        fontFamily: font,
        fontSize: 20,
      },
    })).to.deep.equal({
      foo: 'foo_b5kqh',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(
        '@font-face{font-family:FontName;font-style:normal;font-weight:normal;src:url(\'coolfont.woff2\') format(\'woff2\');}.foo_b5kqh{font-family:"FontName" !important;font-size:20px !important;}',
      );
      done();
    }, 0);
  });

  it('supports animations', (done) => {
    const translateKeyframes = {
      '0%': { transform: 'translateX(0)' },
      '50%': { transform: 'translateX(100px)' },
      '100%': { transform: 'translateX(0)' },
    };

    const opacityKeyframes = {
      from: { opacity: 0 },
      to: { opacity: 1 },
    };

    expect(instance.transform('foo', {
      foo: {
        animationName: [translateKeyframes, opacityKeyframes],
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    })).to.deep.equal({
      foo: 'foo_1lseykp',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(
        '@keyframes keyframe_1ley5wc{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);}50%{-webkit-transform:translateX(100px);-ms-transform:translateX(100px);transform:translateX(100px);}100%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);}}@keyframes keyframe_cwjpzv{from{opacity:0;}to{opacity:1;}}.foo_1lseykp{-webkit-animation-name:keyframe_1ley5wc,keyframe_cwjpzv !important;-webkit-animation-duration:3s, 1200ms !important;-webkit-animation-iteration-count:infinite !important;animation-name:keyframe_1ley5wc,keyframe_cwjpzv !important;animation-duration:3s, 1200ms !important;animation-iteration-count:infinite !important;}',
      );
      done();
    }, 0);
  });

  it('supports media queries', (done) => {
    expect(instance.transform('foo', {
      foo: {
        color: 'red',
        '@media(min-width: 300px)': {
          color: 'blue',
        },
      },
    })).to.deep.equal({
      foo: 'foo_13ib8xx',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(
        '.foo_13ib8xx{color:red !important;}@media(min-width: 300px){.foo_13ib8xx{color:blue !important;}}',
      );
      done();
    }, 0);
  });
});
