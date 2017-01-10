import { expect } from 'chai';
import injectFallbacks from '../../src/utils/injectFallbacks';

describe('utils/injectFallbacks()', () => {
  const fallbacks = {
    background: 'red',
    display: ['box', 'flex-box'],
  };

  it('does nothing if the prop doesnt exist', () => {
    const props = {};

    injectFallbacks(props, fallbacks);

    expect(props).to.deep.equal({});
  });

  it('adds a single fallback', () => {
    const props = {
      background: 'black',
    };

    injectFallbacks(props, fallbacks);

    expect(props).to.deep.equal({
      background: ['red', 'black'],
    });
  });

  it('adds multiple fallbacks', () => {
    const props = {
      display: 'flex',
    };

    injectFallbacks(props, fallbacks);

    expect(props).to.deep.equal({
      display: ['box', 'flex-box', 'flex'],
    });
  });
});
