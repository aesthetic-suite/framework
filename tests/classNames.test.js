import classNames from '../src/classNames';

describe('classNames()', () => {
  it('ignores falsey values', () => {
    expect(classNames(null, false, 0, '', undefined, [], {})).toBe('');
  });

  it('strips period prefix', () => {
    expect(classNames('.foo', 'bar qux', { '.baz': true })).toBe('foo bar qux baz');
  });

  it('handles expression values', () => {
    expect(classNames('foo', true && 'bar', (5 > 10) && 'baz')).toBe('foo bar');
  });

  it('joins strings and numbers', () => {
    expect(classNames('foo', 123, 'bar')).toBe('foo 123 bar');
  });

  it('joins object keys that evaluate to true', () => {
    const baz = 'baz';

    expect(classNames('foo', {
      'foo--active': true,
      bar: false,
      [`${baz}`]: (5 > 1),
    })).toBe('foo foo--active baz');
  });

  it('joins array values', () => {
    expect(classNames('foo', [
      'bar',
      true && 'baz',
      false && 'qux',
      [
        123,
        {
          oof: ('a' === 'a'), // eslint-disable-line
          rab: false,
          zab: true,
        },
        '.remove-prefix',
      ],
      [],
    ])).toBe('foo bar baz 123 oof zab remove-prefix');
  });
});
