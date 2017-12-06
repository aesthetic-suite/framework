import injectFontFaces from '../src/injectFontFaces';
import { FONT_ROBOTO, FONT_ROBOTO_FLAT_SRC } from '../../../tests/mocks';

describe('aesthetic-utils/injectFontFaces()', () => {
  const fontFaces = {
    Roboto: [FONT_ROBOTO],
  };

  it('does nothing if `fontFamily` doesnt exist', () => {
    const obj = {};

    injectFontFaces(obj, fontFaces);

    expect(obj).toEqual({});
  });

  it('replaces font families with font face objects', () => {
    const obj = {
      fontFamily: 'Roboto',
    };

    injectFontFaces(obj, fontFaces);

    expect(obj).toEqual({
      fontFamily: [FONT_ROBOTO],
    });
  });

  it('skips strings and unsupported font families', () => {
    const obj = {
      fontFamily: 'Roboto, Open Sans, sans-serif',
    };

    injectFontFaces(obj, fontFaces);

    expect(obj).toEqual({
      fontFamily: [FONT_ROBOTO, 'Open Sans', 'sans-serif'],
    });
  });

  it('formats font face if `format` option is true', () => {
    const obj = {
      fontFamily: 'Roboto',
    };

    injectFontFaces(obj, fontFaces, { format: true });

    expect(obj).toEqual({
      fontFamily: [FONT_ROBOTO_FLAT_SRC],
    });
  });

  it('joins font face if `join` option is true', () => {
    const obj = {
      fontFamily: 'Roboto, sans-serif',
    };

    injectFontFaces(obj, {
      Roboto: ['roboto2381fh'],
    }, { join: true });

    expect(obj).toEqual({
      fontFamily: 'roboto2381fh, sans-serif',
    });
  });
});
