import toObjectRecursive from '../../src/helpers/toObjectRecursive';

describe('toObjectRecursive()', () => {
  it('calls `toObject` on object', () => {
    expect(
      toObjectRecursive({
        foo: {
          toObject() {
            return 123;
          },
        },
      }),
    ).toEqual({ foo: 123 });
  });

  it('calls `toObject` on a map', () => {
    const map = new Map();

    map.set('foo', {
      toObject() {
        return 123;
      },
    });

    expect(toObjectRecursive(map)).toEqual({ foo: 123 });
  });
});
