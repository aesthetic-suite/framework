import prefixSelectors, { prefixSelector } from '../src/prefixSelectors';

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

describe('prefixSelectors()', () => {
  it('prefixes multiple selectors', () => {
    expect(
      prefixSelectors([':fullscreen', '::backdrop'], '.d:fullscreen::backdrop { display:none; }'),
    ).toBe(
      '.d:-ms-fullscreen::-ms-backdrop { display:none; }.d:-webkit-fullscreen::backdrop { display:none; }.d:fullscreen::backdrop { display:none; }.d:-ms-fullscreen::-webkit-backdrop { display:none; }.d:-webkit-fullscreen::backdrop { display:none; }.d:fullscreen::backdrop { display:none; }.d:-ms-fullscreen::backdrop { display:none; }.d:-webkit-fullscreen::backdrop { display:none; }.d:fullscreen::backdrop { display:none; }',
    );
  });
});
