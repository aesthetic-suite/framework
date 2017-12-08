import injectMediaQueries from '../src/injectMediaQueries';

describe('aesthetic-utils/injectMediaQueries()', () => {
  it('adds @media nested block', () => {
    const obj = {};

    injectMediaQueries(obj, {
      '(min-width: 300px)': {
        color: 'blue',
      },
    });

    expect(obj).toEqual({
      '@media (min-width: 300px)': {
        color: 'blue',
      },
    });
  });
});
