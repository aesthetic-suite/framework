import formatImport from '../src/formatImport';

describe('formatImport()', () => {
  it('returns strings as is', () => {
    expect(formatImport('"test.css"')).toBe('"test.css"');
    expect(formatImport('"test.css" screen')).toBe('"test.css" screen');
    expect(formatImport('url("test.css") screen')).toBe('url("test.css") screen');
  });

  it('formats path', () => {
    expect(formatImport({ path: 'test.css' })).toBe('"test.css"');
  });

  it('formats path wrapped in url()', () => {
    expect(formatImport({ path: 'test.css', url: true })).toBe('url("test.css")');
  });

  it('formats path and media', () => {
    expect(formatImport({ path: 'test.css', media: 'screen' })).toBe('"test.css" screen');
  });

  it('formats everything', () => {
    expect(formatImport({ path: 'test.css', media: 'screen', url: true })).toBe(
      'url("test.css") screen',
    );
  });
});
