import { expect } from 'chai';
import CSSModulesAdapter from '../src/CSSModulesAdapter';

describe('CSSModulesAdapter', () => {
  it('prefixes class names with the style name', () => {
    const instance = new CSSModulesAdapter();

    // eslint-disable-next-line global-require
    expect(instance.transformStyles('foo', require('./styles.css'))).to.deep.equal({
      header: 'foo-styles__header___Mfm87',
      footer: 'foo-styles__footer___1Diz0',
    });
  });
});
