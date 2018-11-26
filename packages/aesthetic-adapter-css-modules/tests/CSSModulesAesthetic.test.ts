import CSSModulesAesthetic from '../src';

describe('CSSModulesAesthetic', () => {
  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAesthetic();

    // eslint-disable-next-line global-require
    const classes = require('./styles.css');

    expect(instance.transformStyles(classes.header, classes.footer)).toBe(
      'styles__header___3btY- styles__footer___NPE7C',
    );
  });
});
