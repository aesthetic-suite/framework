import prefixSelector from '../src/prefixSelector';

describe('prefixSelector()', () => {
  it('doesnt prefix for unsupported selector', () => {
    expect(prefixSelector(':hover', '.c:hover { display:none; }')).toBe(
      '.c:hover { display:none; }',
    );
  });

  it('doesnt prefix for attribute selector', () => {
    expect(prefixSelector('[title]', '.c[title] { display:none; }')).toBe(
      '.c[title] { display:none; }',
    );
  });

  it('prefixes a supported pseudo class', () => {
    expect(prefixSelector(':fullscreen', '.d:fullscreen { display:none; }')).toBe(
      '.d:-ms-fullscreen { display:none; }.d:-webkit-fullscreen { display:none; }.d:fullscreen { display:none; }',
    );
  });

  it('prefixes a supported pseudo element', () => {
    expect(prefixSelector('::backdrop', '.a::backdrop { background:black; }')).toBe(
      '.a::-ms-backdrop { background:black; }.a::-webkit-backdrop { background:black; }.a::backdrop { background:black; }',
    );
  });
});
