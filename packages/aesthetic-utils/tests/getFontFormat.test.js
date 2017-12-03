import getFontFormat from '../src/getFontFormat';

describe('aesthetic-utils/getFontFormat()', () => {
  it('returns the format from ext', () => {
    expect(getFontFormat('Roboto.woff')).toBe('woff');
    expect(getFontFormat('Roboto.ttf')).toBe('truetype');
    expect(getFontFormat('Roboto.eot')).toBe('embedded-opentype');
  });

  it('throws for an unsupported format', () => {
    expect(() => {
      getFontFormat('Roboto.foo');
    }).toThrowError('Unsupported font format ".foo".');
  });
});
