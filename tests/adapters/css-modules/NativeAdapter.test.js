import { expect } from 'chai';
import CSSModulesAdapter from '../../../src/adapters/css-modules/NativeAdapter';

describe('adapters/css-modules/NativeAdapter', () => {
  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAdapter();

    // eslint-disable-next-line global-require
    expect(instance.transform('foo', require('./styles.css'))).to.deep.equal({
      header: 'foo-styles__header___15CNA',
      footer: 'foo-styles__footer___2OPZU',
    });
  });
});
