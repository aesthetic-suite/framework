import processProperties from '../../src/helpers/processProperties';

describe('processProperties()', () => {
  it('does nothing for a non-prefixed property', () => {
    expect(processProperties({ background: 'none' }, { prefix: true })).toEqual({
      background: 'none',
    });
  });

  it('duplicates properties that need prefixing', () => {
    expect(
      processProperties({ appearance: 'none', 'user-select': 'none' }, { prefix: true }),
    ).toEqual({
      appearance: 'none',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      '-ms-appearance': 'none',
      'user-select': 'none',
      '-webkit-user-select': 'none',
      '-ms-user-select': 'none',
    });
  });

  it('doesnt duplicates properties that need prefixing if `prefix` is false', () => {
    expect(
      processProperties({ appearance: 'none', 'user-select': 'none' }, { prefix: false }),
    ).toEqual({
      appearance: 'none',
      'user-select': 'none',
    });
  });
});
