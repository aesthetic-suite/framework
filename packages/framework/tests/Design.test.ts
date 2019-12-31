import { Design } from '../src';

describe('Design', () => {
  it('works', () => {
    console.log(
      new Design({
        colors: ['red'],
        spacing: {
          type: 'unit',
        },
      }).tokens,
    );

    console.log(
      new Design({
        colors: ['red'],
        strategy: 'desktop-first',
        typography: {
          fontSize: 20,
        },
      }).tokens,
    );

    expect(true).toBe(true);
  });
});
