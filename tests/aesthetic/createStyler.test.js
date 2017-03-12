import Aesthetic from '../../packages/aesthetic/src/Aesthetic';
import Adapter from '../../packages/aesthetic/src/Adapter';
import createStyler from '../../packages/aesthetic/src/createStyler';

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
