import injectFallbacks from '../../packages/aesthetic-utils/src/injectFallbacks';

describe('aesthetic-utils/injectFallbacks()', () => {
  const fallbacks = {
    background: 'red',
    display: ['box', 'flex-box'],
  };

  it('does nothing if the prop doesnt exist', () => {
    const props = {};

    injectFallbacks(props, fallbacks);

    expect(props).toEqual({});
  });

  it('adds a single fallback', () => {
    const props = {
      background: 'black',
    };

    injectFallbacks(props, fallbacks);

    expect(props).toEqual({
      background: ['red', 'black'],
    });
  });

  it('adds multiple fallbacks', () => {
    const props = {
      display: 'flex',
    };

    injectFallbacks(props, fallbacks);

    expect(props).toEqual({
      display: ['box', 'flex-box', 'flex'],
    });
  });
});
