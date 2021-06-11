import { FontFace } from '@aesthetic/types';
import { formatFontFace, formatImport } from '../src';

const FONT_ROBOTO: FontFace = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  local: ['Robo'],
  srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
};

const FONT_ROBOTO_FLAT_SRC: FontFace = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src:
    "local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
};

describe('formatFontFace()', () => {
  it('converts the src array to a string with formats', () => {
    expect(formatFontFace(FONT_ROBOTO)).toEqual(FONT_ROBOTO_FLAT_SRC);
  });

  it('supports flat src strings', () => {
    expect(formatFontFace(FONT_ROBOTO_FLAT_SRC)).toEqual(FONT_ROBOTO_FLAT_SRC);
  });

  it('includes local aliases with src paths', () => {
    expect(
      formatFontFace({
        ...FONT_ROBOTO,
        local: ['MrRoboto'],
      }),
    ).toEqual({
      ...FONT_ROBOTO_FLAT_SRC,
      src:
        "local('MrRoboto'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
    });
  });

  it('ignores local aliases for flat src strings', () => {
    expect(
      formatFontFace({
        ...FONT_ROBOTO_FLAT_SRC,
        local: ['MrRoboto'],
      }),
    ).toEqual(FONT_ROBOTO_FLAT_SRC);
  });

  it('throws for an unsupported format', () => {
    expect(() => {
      formatFontFace({
        ...FONT_ROBOTO,
        srcPaths: ['Roboto.foo'],
      });
    }).toThrow('Unsupported font format ".foo".');
  });

  it('supports paths with query strings', () => {
    expect(
      formatFontFace({
        ...FONT_ROBOTO,
        srcPaths: ['Roboto.woff2?abc'],
      }),
    ).toEqual({
      ...FONT_ROBOTO_FLAT_SRC,
      src: "local('Robo'), url('Roboto.woff2?abc') format('woff2')",
    });
  });
});

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
