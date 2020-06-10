import processProperties from '../../src/helpers/processProperties';

describe('processProperties()', () => {
  it('removes undefined values', () => {
    expect(processProperties({ background: undefined })).toEqual({});
  });

  describe('prefixes', () => {
    it('does nothing for an unsupported property', () => {
      expect(processProperties({ background: 'none' }, { vendor: true })).toEqual({
        background: 'none',
      });
    });

    it('adds vendor prefixed properties for those that need prefixing', () => {
      expect(
        processProperties({ appearance: 'none', 'user-select': 'none' }, { vendor: true }),
      ).toEqual({
        '-ms-appearance': 'none',
        '-moz-appearance': 'none',
        '-webkit-appearance': 'none',
        appearance: 'none',
        '-ms-user-select': 'none',
        '-webkit-user-select': 'none',
        'user-select': 'none',
      });
    });

    it('doesnt add vendor prefixed properties for those that need prefixing if `prefix` is false', () => {
      expect(
        processProperties({ appearance: 'none', 'user-select': 'none' }, { vendor: false }),
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
        ),
      ).toEqual({
        'background-image': [
          '-ms-cross-fade(url(white.png) 0%, url(black.png) 100%);',
          '-webkit-cross-fade(url(white.png) 0%, url(black.png) 100%);',
          'cross-fade(url(white.png) 0%, url(black.png) 100%);',
        ],
      });
    });

    it('adds vendor prefixed properties for values', () => {
      expect(processProperties({ 'unicode-bidi': 'isolate' }, { vendor: true })).toEqual({
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
