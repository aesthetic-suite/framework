import { ClientRenderer } from '@aesthetic/style';
import { LocalSheet } from '../src';
import { lightTheme } from '../src/testing';

describe('LocalSheet', () => {
  let renderer: ClientRenderer;
  let sheet: LocalSheet;

  beforeEach(() => {
    renderer = new ClientRenderer();
    sheet = new LocalSheet(() => ({
      foo: {
        display: 'block',
        background: 'white',
        color: 'black',
        fontSize: 12,
        fontFamily: [
          '"Open Sans"',
          {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
          },
        ],
      },
      bar: {
        transition: '200ms all',
        animationName: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      baz: 'class-baz',
    }));
  });

  it('errors if a non-function factory is passed', () => {
    expect(
      () =>
        new LocalSheet(
          // @ts-expect-error
          123,
        ),
    ).toThrow('A style sheet factory function is required, found "number".');
  });

  it('only renders once when cached', () => {
    const spy = jest.spyOn(sheet, 'compose');

    sheet.render(renderer, lightTheme, {});
    sheet.render(renderer, lightTheme, {});
    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('re-renders when params change', () => {
    const spy = jest.spyOn(sheet, 'compose');

    sheet.render(renderer, lightTheme, {});
    sheet.render(renderer, lightTheme, { direction: 'rtl' });
    sheet.render(renderer, lightTheme, {});
    sheet.render(renderer, lightTheme, { direction: 'rtl' });

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('renders and returns an object of class names', () => {
    const classes = sheet.render(renderer, lightTheme, {});

    expect(classes).toEqual({
      foo: 'a b c d e',
      bar: 'f g',
      baz: 'class-baz',
    });
  });

  it('renders a rule for each set', () => {
    const spy = jest.spyOn(renderer, 'renderRule');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith(
      {
        display: 'block',
        background: 'white',
        color: 'black',
        fontSize: '12px',
        fontFamily: '"Open Sans", Roboto',
      },
      {
        prefix: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rankings: expect.any(Object),
        rtl: false,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      {
        transition: '200ms all',
        animationName: 'kf1plt5bd',
      },
      {
        prefix: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rankings: expect.any(Object),
        rtl: false,
      },
    );
  });

  it('renders @font-face', () => {
    const spy = jest.spyOn(renderer, 'renderFontFace');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith({
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
    });
  });

  it('renders @keyframes', () => {
    const spy = jest.spyOn(renderer, 'renderKeyframes');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith(
      {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      undefined,
      {
        prefix: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rankings: expect.any(Object),
        rtl: false,
      },
    );
  });

  describe('variants', () => {
    beforeEach(() => {
      sheet.addColorSchemeVariant('dark', () => ({
        foo: {
          background: 'black',
          color: 'white',
        },
      }));

      sheet.addContrastVariant('high', () => ({
        foo: {
          background: 'pink',
        },
      }));

      sheet.addContrastVariant('low', () => ({
        foo: {
          background: 'yellow',
        },
      }));

      sheet.addThemeVariant('danger', () => ({
        foo: {
          background: 'red',
          color: 'yellow',
        },
      }));
    });

    it('errors for invalid color scheme name', () => {
      expect(() => {
        sheet.addColorSchemeVariant(
          // @ts-expect-error
          'unknown',
          () => ({}),
        );
      }).toThrow('Color scheme variant must be one of "light" or "dark".');
    });

    it('errors for invalid contrast name', () => {
      expect(() => {
        sheet.addContrastVariant(
          // @ts-expect-error
          'unknown',
          () => ({}),
        );
      }).toThrow('Contrast level variant must be one of "high", "low", or "normal".');
    });

    it('inherits color scheme', () => {
      const spy = jest.spyOn(renderer, 'renderRule');

      sheet.render(renderer, lightTheme, {
        scheme: 'dark',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          background: 'black',
          color: 'white',
        }),
        expect.anything(),
      );
    });

    it('inherits high contrast', () => {
      const spy = jest.spyOn(renderer, 'renderRule');

      sheet.render(renderer, lightTheme, {
        contrast: 'high',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          background: 'pink',
          color: 'black',
        }),
        expect.anything(),
      );
    });

    it('inherits low contrast', () => {
      const spy = jest.spyOn(renderer, 'renderRule');

      sheet.render(renderer, lightTheme, {
        contrast: 'low',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          background: 'yellow',
          color: 'black',
        }),
        expect.anything(),
      );
    });

    it('inherits theme by name', () => {
      const spy = jest.spyOn(renderer, 'renderRule');

      sheet.render(renderer, lightTheme, {
        theme: 'danger',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          background: 'red',
          color: 'yellow',
        }),
        expect.anything(),
      );
    });

    it('contrast overrides scheme', () => {
      const spy = jest.spyOn(renderer, 'renderRule');

      sheet.render(renderer, lightTheme, {
        scheme: 'dark',
        contrast: 'low',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          background: 'yellow',
          color: 'white',
        }),
        expect.anything(),
      );
    });

    it('theme overrides contrast and scheme', () => {
      const spy = jest.spyOn(renderer, 'renderRule');

      sheet.render(renderer, lightTheme, {
        scheme: 'dark',
        contrast: 'high',
        theme: 'danger',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          background: 'red',
          color: 'yellow',
        }),
        expect.anything(),
      );
    });
  });
});
