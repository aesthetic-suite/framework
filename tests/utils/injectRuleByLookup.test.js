import { expect } from 'chai';
import injectRuleByLookup from '../../src/utils/injectRuleByLookup';

describe('utils/injectRuleByLookup()', () => {
  it('does nothing if value isnt a string', () => {
    const props = { fontFamily: true };

    injectRuleByLookup(props, 'fontFamily', {});

    expect(props).to.deep.equal(props);
  });

  it('returns array if no lookup found', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {});

    expect(props).to.deep.equal({
      fontFamily: ['Arial', 'Verdana'],
    });
  });

  it('returns the object lookup in the array', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: {
        fontSrc: 'src("arial.woff")',
      },
    });

    expect(props).to.deep.equal({
      fontFamily: [{
        fontSrc: 'src("arial.woff")',
      }, 'Verdana'],
    });
  });

  it('returns the string lookup in the array', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: 'NewArial',
    });

    expect(props).to.deep.equal({
      fontFamily: ['NewArial', 'Verdana'],
    });
  });

  it('returns the first lookup value if its an array', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: ['NewArial', 'OtherArial'],
    });

    expect(props).to.deep.equal({
      fontFamily: ['NewArial', 'Verdana'],
    });
  });

  it('can flatten the array back to a string', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: 'NewArial',
    }, true);

    expect(props).to.deep.equal({
      fontFamily: 'NewArial, Verdana',
    });
  });
});
