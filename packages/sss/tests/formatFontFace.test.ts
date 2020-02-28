import formatFontFace from '../src/formatFontFace';
import { FONT_ROBOTO, FONT_ROBOTO_FLAT_SRC } from './__mocks__/global';

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
