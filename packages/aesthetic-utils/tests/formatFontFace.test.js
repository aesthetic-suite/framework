import formatFontFace from '../src/formatFontFace';
import { FONT_ROBOTO } from '../../../tests/mocks';

describe('aesthetic-utils/formatFontFace()', () => {
  it('converts the src array to a string with formats', () => {
    expect(formatFontFace(FONT_ROBOTO)).toEqual({
      ...FONT_ROBOTO,
      src: "url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
    });
  });

  it('includes local aliases', () => {
    expect(formatFontFace({
      ...FONT_ROBOTO,
      localAlias: ['MrRoboto'],
    })).toEqual({
      ...FONT_ROBOTO,
      src: "local('MrRoboto'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
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
