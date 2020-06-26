import { ClientRenderer } from '@aesthetic/style';
import { GlobalSheet } from '../src';
import { lightTheme } from '../src/testing';

describe('GlobalSheet', () => {
  let renderer: ClientRenderer;
  let sheet: GlobalSheet;

  beforeEach(() => {
    renderer = new ClientRenderer();
    sheet = new GlobalSheet(() => ({
      '@font-face': {
        Roboto: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          local: ['Robo'],
          srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
        },
      },
      '@global': {
        height: '100%',
        margin: 0,
        fontSize: 16,
        lineHeight: 1.5,
        backgroundColor: 'white',
      },
      '@import': ['url("reset.css")', { path: 'normalize.css', url: true }],
      '@keyframes': {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      '@page': {
        size: '8.5in 11in',
      },
      '@viewport': {
        width: 'device-width',
        orientation: 'landscape',
      },
    }));
  });

  it('errors if a non-function factory is passed', () => {
    expect(
      () =>
        new GlobalSheet(
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

  it('renders @font-face', () => {
    const spy = jest.spyOn(renderer, 'renderFontFace');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith({
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src:
        "local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
    });
  });

  it('renders @global', () => {
    const spy = jest.spyOn(renderer, 'renderRuleGrouped');
    const className = sheet.render(renderer, lightTheme, {});

    expect(className).toBe('c954zw4');
    expect(spy).toHaveBeenCalledWith(
      {
        height: '100%',
        margin: 0,
        fontSize: 16,
        lineHeight: 1.5,
        backgroundColor: 'white',
      },
      {
        deterministic: true,
        rtl: false,
        type: 'global',
        unit: 'px',
        vendor: false,
      },
    );
  });

  it('renders @import', () => {
    const spy = jest.spyOn(renderer, 'renderImport');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith('url("reset.css")');
    expect(spy).toHaveBeenCalledWith('url("normalize.css")');
  });

  it('renders @keyframes', () => {
    const spy = jest.spyOn(renderer, 'renderKeyframes');

    sheet.render(renderer, lightTheme, {});

    expect(spy).toHaveBeenCalledWith(
      {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      'fade',
      {
        rtl: false,
        unit: 'px',
        vendor: false,
      },
    );
  });
});
