import Aesthetic from '../src/Aesthetic';
import createStyler from '../src/createStyler';
import { TestAdapter } from '../../../tests/mocks';

describe('aesthetic/createStyler()', () => {
  it('errors if no `Aesthetic` is provided', () => {
    expect(() => createStyler()).toThrowError('An instance of `Aesthetic` must be provided.');
    expect(() => createStyler(123)).toThrowError('An instance of `Aesthetic` must be provided.');
  });

  it('returns an object with helper functions', () => {
    const styler = createStyler(new Aesthetic(new TestAdapter()));

    expect(styler.style).toBeInstanceOf(Function);
    expect(styler.transform).toBeInstanceOf(Function);
  });

  it('style function returns an HOC function', () => {
    const styler = createStyler(new Aesthetic(new TestAdapter()));

    expect(styler.style()).toBeInstanceOf(Function);
  });

  it('style function calls Aesthetic', () => {
    const aesthetic = new Aesthetic(new TestAdapter());
    const styler = createStyler(aesthetic);
    const spy = jest.spyOn(aesthetic, 'withStyles');

    styler.style();

    expect(spy).toHaveBeenCalled();
  });

  it('transform function calls Aesthetic', () => {
    const aesthetic = new Aesthetic(new TestAdapter());
    const styler = createStyler(aesthetic);
    const spy = jest.spyOn(aesthetic, 'transformStyles');

    styler.transform({});

    expect(spy).toHaveBeenCalled();
  });
});
