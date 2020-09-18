import converter from '@aesthetic/addon-direction';
import prefixer from '@aesthetic/addon-vendor';
import processProperties from '../../src/helpers/processProperties';

describe('processProperties()', () => {
  it('removes undefined values', () => {
    expect(processProperties({ background: undefined }, {}, { direction: 'ltr' })).toEqual({});
  });

  describe('prefixes', () => {
    it('does nothing for an unsupported property', () => {
      expect(
        processProperties({ background: 'none' }, { vendor: true }, { direction: 'ltr', prefixer }),
      ).toEqual({
        background: 'none',
      });
    });

    it('adds vendor prefixed properties for those that need prefixing', () => {
      expect(
        processProperties(
          { appearance: 'none', 'user-select': 'none' },
          { vendor: true },
          { direction: 'ltr', prefixer },
        ),
      ).toEqual({
        '-moz-appearance': 'none',
        '-webkit-appearance': 'none',
        appearance: 'none',
        '-ms-user-select': 'none',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      });
    });

    it('doesnt add vendor prefixed properties for those that need prefixing if `vendor` is false', () => {
      expect(
        processProperties(
          { appearance: 'none', 'user-select': 'none' },
          { vendor: false },
          { direction: 'ltr', prefixer },
        ),
      ).toEqual({
        appearance: 'none',
        'user-select': 'none',
      });
    });

    it('adds vendor prefixed properties for value functions', () => {
      expect(
        processProperties(
          { 'background-image': 'cross-fade(url(white.png) 0%, url(black.png) 100%);' },
          { vendor: true },
          { direction: 'ltr', prefixer },
        ),
      ).toEqual({
        'background-image': [
          '-webkit-cross-fade(url(white.png) 0%, url(black.png) 100%);',
          'cross-fade(url(white.png) 0%, url(black.png) 100%);',
        ],
      });
    });

    it('adds vendor prefixed properties for values', () => {
      expect(
        processProperties(
          { 'unicode-bidi': 'isolate' },
          { vendor: true },
          { direction: 'ltr', prefixer },
        ),
      ).toEqual({
        'unicode-bidi': ['-webkit-isolate', 'isolate'],
      });
    });
  });

  describe('direction', () => {
    it('doesnt convert if same direction', () => {
      expect(
        processProperties(
          { 'margin-top': 0, 'margin-left': '10px', 'text-align': 'left' },
          { direction: 'ltr' },
          { direction: 'ltr', converter },
        ),
      ).toEqual({
        'margin-top': 0,
        'margin-left': '10px',
        'text-align': 'left',
      });
    });

    it('converts LTR to RTL properties', () => {
      expect(
        processProperties(
          { 'margin-top': 0, 'margin-left': '10px', 'text-align': 'left' },
          { direction: 'rtl' },
          { direction: 'ltr', converter },
        ),
      ).toEqual({
        'margin-top': 0,
        'margin-right': '10px',
        'text-align': 'right',
      });
    });

    it('convert RTL to LTR properties', () => {
      expect(
        processProperties(
          { 'margin-top': 0, 'margin-right': '10px', 'text-align': 'right' },
          { direction: 'ltr' },
          { direction: 'rtl', converter },
        ),
      ).toEqual({
        'margin-top': 0,
        'margin-left': '10px',
        'text-align': 'left',
      });
    });
  });
});
