import formatFontFace from '../../src/helpers/formatFontFace';
import { FONT_ROBOTO, FONT_ROBOTO_FLAT_SRC } from '../../../../tests/mocks';

describe('aesthetic-utils/formatFontFace()', () => {
  it('converts the src array to a string with formats', () => {
    expect(formatFontFace(FONT_ROBOTO)).toEqual({
      ...FONT_ROBOTO,
      src: "url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
    });
  });

  it('supports flat src strings', () => {
    expect(formatFontFace(FONT_ROBOTO_FLAT_SRC)).toEqual(FONT_ROBOTO_FLAT_SRC);
  });

  it('includes local aliases', () => {
    expect(formatFontFace({
      ...FONT_ROBOTO,
      local: ['MrRoboto'],
    })).toEqual({
      ...FONT_ROBOTO,
      src: "local('MrRoboto'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
    });
  });

  it('includes local aliases for flat src strings', () => {
    expect(formatFontFace({
      ...FONT_ROBOTO_FLAT_SRC,
      local: ['MrRoboto'],
    })).toEqual({
      ...FONT_ROBOTO,
      src: `local('MrRoboto'), ${FONT_ROBOTO_FLAT_SRC.src}`,
    });
  });

  it('throws for an unsupported format', () => {
    expect(() => {
      formatFontFace({
        ...FONT_ROBOTO,
        src: ['Roboto.foo'],
      });
    }).toThrowError('Unsupported font format ".foo".');
  });
});
