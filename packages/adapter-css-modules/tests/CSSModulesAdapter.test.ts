import CSSModulesAdapter from '../src';

describe('CSSModulesAdapter', () => {
  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAdapter();

    // eslint-disable-next-line global-require
    const classes = require('./styles.css');

    expect(instance.transformStyles([classes.header, classes.footer], {})).toBe(
      'styles__header___3JVTA styles__footer___1Vp0S',
    );
  });
});
