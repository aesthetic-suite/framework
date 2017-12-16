import CSSModulesAdapter from '../src/NativeAdapter';

describe('aesthetic-adapter-css-modules/NativeAdapter', () => {
  it('errors for no React Native support', () => {
    const instance = new CSSModulesAdapter();
    instance.native = true;

    expect(() => instance.transform()).toThrowError('CSS modules do not support React Native.');
  });

  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAdapter();

    // eslint-disable-next-line global-require
    expect(instance.transform('foo', require('./styles.css'))).toEqual({
      footer: 'styles__footer___NPE7C',
      header: 'styles__header___3btY-',
    });
  });
});
