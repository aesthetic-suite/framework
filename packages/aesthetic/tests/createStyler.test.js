import { expect } from 'chai';
import Aesthetic from '../src/Aesthetic';
import createStyler from '../src/createStyler';

describe('createStyler()', () => {
  it('errors if no `Aesthetic` is provided', () => {
    expect(() => createStyler()).to.throw(TypeError);
    expect(() => createStyler(123)).to.throw(TypeError);
  });

  it('returns an HOC function', () => {
    const styler = createStyler(new Aesthetic());

    expect(styler).to.be.an('function');
    expect(styler()).to.be.an('function');
  });
});
