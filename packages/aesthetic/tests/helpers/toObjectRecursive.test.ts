import toObjectRecursive from '../../src/helpers/toObjectRecursive';

describe('toObjectRecursive()', () => {
  it('calls toObject on object', () => {
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
});
