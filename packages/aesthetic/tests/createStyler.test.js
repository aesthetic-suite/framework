import Aesthetic from '../src/Aesthetic';
import Adapter from '../src/Adapter';
import createStyler from '../src/createStyler';

describe('aesthetic/createStyler()', () => {
  it('errors if no `Aesthetic` is provided', () => {
    expect(() => createStyler()).toThrowError('An instance of `Aesthetic` must be provided.');
    expect(() => createStyler(123)).toThrowError('An instance of `Aesthetic` must be provided.');
  });

  it('returns an HOC function', () => {
    const styler = createStyler(new Aesthetic(new Adapter()));

    expect(styler).toBeInstanceOf(Function);
    expect(styler()).toBeInstanceOf(Function);
  });
});
