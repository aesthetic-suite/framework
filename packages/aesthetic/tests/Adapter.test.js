import Adapter from '../src/Adapter';
import { TestAdapter, FONT_ROBOTO, KEYFRAME_FADE } from '../../../tests/mocks';

describe('aesthetic/Adapter', () => {
  it('inherits options through the constructor', () => {
    const instance = new Adapter({ foo: 'bar' });

    expect(instance.options).toEqual({ foo: 'bar' });
  });

  describe('transform()', () => {
    it('errors if not defined', () => {
      expect(() => (new Adapter()).transform())
        .toThrowError('Adapter must define the `transform` method.');
    });

    it('transforms with native syntax', () => {
      const instance = new TestAdapter();

      expect(instance.transform('foo', {
        '@font-face': FONT_ROBOTO,
        '@keyframes fade': KEYFRAME_FADE,
        button: {
          margin: 0,
          padding: 5,
          display: 'inline-block',
          backgroundColor: '#ccc',
          '&:hover': {
            backgroundColor: '#eee',
          },
          '&::before': {
            content: '★',
            display: 'inline-block',
            marginRight: 5,
          },
          '@media (min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      })).toEqual({
        '@font-face': FONT_ROBOTO,
        '@keyframes fade': KEYFRAME_FADE,
        button: {
          margin: 0,
          padding: 5,
          display: 'inline-block',
          backgroundColor: '#ccc',
          '&:hover': {
            backgroundColor: '#eee',
          },
          '&::before': {
            content: '★',
            display: 'inline-block',
            marginRight: 5,
          },
          '@media (min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      });
    });
  });
});
