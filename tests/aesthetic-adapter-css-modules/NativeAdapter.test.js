import CSSModulesAdapter from '../../packages/aesthetic-adapter-css-modules/src/NativeAdapter';

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
      header: 'foo-styles__header___2ke8B',
      footer: 'foo-styles__footer___3W3HV',
    });
  });
});
