import vendorPrefixer from '@aesthetic/addon-vendor';
import processProperties from '../../src/helpers/processProperties';

describe('processProperties()', () => {
  it('removes undefined values', () => {
    expect(processProperties({ background: undefined })).toEqual({});
  });

  describe('prefixes', () => {
    it('does nothing for an unsupported property', () => {
      expect(processProperties({ background: 'none' }, { vendor: vendorPrefixer })).toEqual({
        background: 'none',
      });
    });

    it('adds vendor prefixed properties for those that need prefixing', () => {
      expect(
        processProperties(
          { appearance: 'none', 'user-select': 'none' },
          { vendor: vendorPrefixer },
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

    it('doesnt add vendor prefixed properties for those that need prefixing if `vendor` is null', () => {
      expect(
        processProperties({ appearance: 'none', 'user-select': 'none' }, { vendor: null }),
      ).toEqual({
        appearance: 'none',
        'user-select': 'none',
      });
    });

    it('adds vendor prefixed properties for value functions', () => {
      expect(
        processProperties(
          { 'background-image': 'cross-fade(url(white.png) 0%, url(black.png) 100%);' },
          { vendor: vendorPrefixer },
        ),
      ).toEqual({
        'background-image': [
          '-webkit-cross-fade(url(white.png) 0%, url(black.png) 100%);',
          'cross-fade(url(white.png) 0%, url(black.png) 100%);',
        ],
      });
    });

    it('adds vendor prefixed properties for values', () => {
      expect(processProperties({ 'unicode-bidi': 'isolate' }, { vendor: vendorPrefixer })).toEqual({
        'unicode-bidi': ['-webkit-isolate', 'isolate'],
      });
    });
  });

  describe('rtl', () => {
    it('converts left to right properties', () => {
      expect(
        processProperties(
          { 'margin-top': 0, 'margin-left': '10px', 'text-align': 'left' },
          { rtl: true },
        ),
      ).toEqual({
        'margin-top': 0,
        'margin-right': '10px',
        'text-align': 'right',
      });
    });
  });
});
