import converter from '@aesthetic/addon-direction';
import { ClientRenderer } from '@aesthetic/style';
import { StyleSheet, LocalSheet, createComponentStyles } from '../src';
import { getRenderedStyles, lightTheme, purgeStyles } from '../src/testing';

describe('LocalSheet', () => {
  let renderer: ClientRenderer;
  let sheet: LocalSheet;

  beforeEach(() => {
    renderer = new ClientRenderer({ converter });
    sheet = createComponentStyles(() => ({
      foo: {
        display: 'block',
        background: 'white',
        color: 'black',
        textAlign: 'left',
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
        ':hover': {
          color: 'red',
        },
        '@selectors': {
          ':focus': {
            outline: 'red',
          },
        },
        '@media': {
          '(max-width: 1000px)': {
            display: 'none',
            borderWidth: 1,
          },
        },
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

  afterEach(() => {
    purgeStyles();
  });

  it('errors if a non-function factory is passed', () => {
    expect(
      () =>
        new StyleSheet(
          'local',
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
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('renders and returns an object of class names', () => {
    const classes = sheet.render(renderer, lightTheme, {});

    expect(classes).toEqual({
      foo: { class: 'a b c d e f g h i j' },
      bar: { class: 'k l' },
      baz: { class: 'class-baz' },
    });
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('renders a declaration for each rule property', () => {
    const spy = jest.spyOn(renderer, 'renderDeclaration');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith('display', 'block', expect.any(Object));
    expect(spy).toHaveBeenCalledWith('background', 'white', expect.any(Object));
    expect(spy).toHaveBeenCalledWith('color', 'black', expect.any(Object));
    expect(spy).toHaveBeenCalledWith('fontSize', 12, expect.any(Object));
    expect(spy).toHaveBeenCalledWith('fontFamily', '"Open Sans", Roboto', expect.any(Object));
  });

  it('renders @font-face', () => {
    const spy = jest.spyOn(renderer, 'renderFontFace');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith(
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        src:
          "url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
      },
      {
        direction: 'ltr',
        rankings: expect.any(Object),
        unit: 'px',
        vendor: false,
      },
    );
    expect(getRenderedStyles('global')).toMatchSnapshot();
  });

  it('renders @keyframes', () => {
    const spy = jest.spyOn(renderer, 'renderKeyframes');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith(
      {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '',
      {
        direction: 'ltr',
        rankings: expect.any(Object),
        unit: 'px',
        vendor: false,
      },
    );
    expect(getRenderedStyles('global')).toMatchSnapshot();
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
      const spy = jest.spyOn(renderer, 'renderDeclaration');

      sheet.render(renderer, lightTheme, {
        scheme: 'dark',
      });

      expect(spy).toHaveBeenCalledWith('background', 'black', expect.any(Object));
      expect(spy).toHaveBeenCalledWith('color', 'white', expect.any(Object));
    });

    it('inherits high contrast', () => {
      const spy = jest.spyOn(renderer, 'renderDeclaration');

      sheet.render(renderer, lightTheme, {
        contrast: 'high',
      });

      expect(spy).toHaveBeenCalledWith('background', 'pink', expect.any(Object));
      expect(spy).toHaveBeenCalledWith('color', 'black', expect.any(Object));
    });

    it('inherits low contrast', () => {
      const spy = jest.spyOn(renderer, 'renderDeclaration');

      sheet.render(renderer, lightTheme, {
        contrast: 'low',
      });

      expect(spy).toHaveBeenCalledWith('background', 'yellow', expect.any(Object));
      expect(spy).toHaveBeenCalledWith('color', 'black', expect.any(Object));
    });

    it('inherits theme by name', () => {
      const spy = jest.spyOn(renderer, 'renderDeclaration');

      sheet.render(renderer, lightTheme, {
        theme: 'danger',
      });

      expect(spy).toHaveBeenCalledWith('background', 'red', expect.any(Object));
      expect(spy).toHaveBeenCalledWith('color', 'yellow', expect.any(Object));
    });

    it('contrast overrides scheme', () => {
      const spy = jest.spyOn(renderer, 'renderDeclaration');

      sheet.render(renderer, lightTheme, {
        scheme: 'dark',
        contrast: 'low',
      });

      expect(spy).toHaveBeenCalledWith('background', 'yellow', expect.any(Object));
      expect(spy).toHaveBeenCalledWith('color', 'white', expect.any(Object));
    });

    it('theme overrides contrast and scheme', () => {
      const spy = jest.spyOn(renderer, 'renderDeclaration');

      sheet.render(renderer, lightTheme, {
        scheme: 'dark',
        contrast: 'high',
        theme: 'danger',
      });

      expect(spy).toHaveBeenCalledWith('background', 'red', expect.any(Object));
      expect(spy).toHaveBeenCalledWith('color', 'yellow', expect.any(Object));
    });
  });
});
