import { expect } from 'chai';
import CSSModulesAdapter from '../src/NativeAdapter';

describe('CSSModulesAdapter', () => {
  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAdapter();

    // eslint-disable-next-line global-require
    expect(instance.transform('foo', require('./styles.css'))).to.deep.equal({
      header: 'foo-styles__header___3btY-',
      footer: 'foo-styles__footer___NPE7C',
    });
  });
});
