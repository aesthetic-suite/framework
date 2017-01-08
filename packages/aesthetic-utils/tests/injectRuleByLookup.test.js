import { expect } from 'chai';
import injectRuleByLookup from '../src/injectRuleByLookup';

describe('injectRuleByLookup()', () => {
  it('does nothing if value isnt a string', () => {
    const props = { fontFamily: true };

    injectRuleByLookup(props, 'fontFamily', {});

    expect(props).to.deep.equal(props);
  });
});
