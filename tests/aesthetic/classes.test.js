import classes from '../../packages/aesthetic/src/classes';

describe('aesthetic/classes()', () => {
  it('ignores falsey values', () => {
    expect(classes(null, false, 0, '', undefined, [], {})).toBe('');
  });

  it('strips period prefix', () => {
    expect(classes('.foo', 'bar qux', { '.baz': true })).toBe('foo bar qux baz');
  });

  it('handles expression values', () => {
    expect(classes('foo', true && 'bar', (5 > 10) && 'baz')).toBe('foo bar');
  });

  it('joins strings and numbers', () => {
    expect(classes('foo', 123, 'bar')).toBe('foo 123 bar');
  });

  it('joins object keys that evaluate to true', () => {
    const baz = 'baz';

    expect(classes('foo', {
      'foo--active': true,
      bar: false,
      [`${baz}`]: (5 > 1),
    })).toBe('foo foo--active baz');
  });

  it('joins array values', () => {
    expect(classes('foo', [
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
