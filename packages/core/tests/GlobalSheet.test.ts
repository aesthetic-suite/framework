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
      // TODO
      '@page': {
        size: '8.5in 11in',
      },
      '@viewport': {
        width: 'device-width',
        orientation: 'landscape',
      },
    }));
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

    expect(className).toBe('ca3196k');
    expect(spy).toHaveBeenCalledWith(
      {
        height: '100%',
        margin: 0,
        fontSize: '16px',
        lineHeight: 1.5,
        backgroundColor: 'white',
      },
      {
        deterministic: true,
        prefix: false,
        rtl: false,
        type: 'global',
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
        prefix: false,
        rtl: false,
      },
    );
  });
});
