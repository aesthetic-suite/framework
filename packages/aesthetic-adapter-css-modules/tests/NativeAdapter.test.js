import CSSModulesAdapter from '../src/NativeAdapter';

describe('aesthetic-adapter-css-modules/NativeAdapter', () => {
  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAdapter();

    // eslint-disable-next-line global-require
    const classes = require('./styles.css');

    expect(instance.transform(classes.header, classes.footer))
      .toBe('styles__header___3btY- styles__footer___NPE7C');
  });
});
