import injectSupports from '../src/injectSupports';

describe('aesthetic-utils/injectSupports()', () => {
  it('adds @supports nested block', () => {
    const obj = {};

    injectSupports(obj, {
      '(display: flex)': {
        display: 'flex',
      },
    });

    expect(obj).toEqual({
      '@supports (display: flex)': {
        display: 'flex',
      },
    });
  });
});
