import injectRuleByLookup from '../../packages/aesthetic-utils/src/injectRuleByLookup';

describe('aesthetic-utils/injectRuleByLookup()', () => {
  it('does nothing if value isnt a string', () => {
    const props = { fontFamily: true };

    injectRuleByLookup(props, 'fontFamily', {});

    expect(props).toEqual(props);
  });

  it('returns array if no lookup found', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {});

    expect(props).toEqual({
      fontFamily: ['Arial', 'Verdana'],
    });
  });

  it('returns a non-array if a single value found', () => {
    const props = { fontFamily: 'Arial' };

    injectRuleByLookup(props, 'fontFamily', {});

    expect(props).toEqual({
      fontFamily: 'Arial',
    });
  });

  it('returns the object lookup in the array', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: {
        fontSrc: 'src("arial.woff")',
      },
    });

    expect(props).toEqual({
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

    expect(props).toEqual({
      fontFamily: ['NewArial', 'Verdana'],
    });
  });

  it('returns the first lookup value if its an array', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: ['NewArial', 'OtherArial'],
    });

    expect(props).toEqual({
      fontFamily: ['NewArial', 'Verdana'],
    });
  });

  it('can flatten the array back to a string', () => {
    const props = { fontFamily: 'Arial, Verdana' };

    injectRuleByLookup(props, 'fontFamily', {
      Arial: 'NewArial',
    }, true);

    expect(props).toEqual({
      fontFamily: 'NewArial, Verdana',
    });
  });
});
