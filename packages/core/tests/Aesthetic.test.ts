import { ClientRenderer } from '@aesthetic/style';
import { ServerRenderer } from '@aesthetic/style/server';
import Aesthetic from '../src/Aesthetic';
import { LocalSheet, GlobalSheet } from '../src';
import { lightTheme, darkTheme, setupAesthetic, teardownAesthetic } from '../src/testing';

describe('Aesthetic', () => {
  let aesthetic: Aesthetic;

  beforeEach(() => {
    aesthetic = new Aesthetic();

    // @ts-expect-error Only need to mock matches
    window.matchMedia = () => ({ matches: false });
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  it('can subscribe and unsubscribe events', () => {
    const spy = jest.fn();

    aesthetic.subscribe('change:theme', spy);

    // @ts-expect-error
    expect(aesthetic.listeners['change:theme'].has(spy)).toBe(true);

    aesthetic.unsubscribe('change:theme', spy);

    // @ts-expect-error
    expect(aesthetic.listeners['change:theme'].has(spy)).toBe(false);
  });

  describe('changeTheme()', () => {
    beforeEach(() => {
      setupAesthetic(aesthetic);
    });

    it('sets active theme', () => {
      expect(aesthetic.activeTheme).toBe('');

      aesthetic.changeTheme('night');

      expect(aesthetic.activeTheme).toBe('night');
    });

    it('doesnt run if changing to same name', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'applyRootVariables');

      aesthetic.changeTheme('night');
      aesthetic.changeTheme('night');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('applies root css variables', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'applyRootVariables');

      aesthetic.changeTheme('night');

      expect(spy).toHaveBeenCalledWith(darkTheme.toVariables());
    });

    it('renders theme sheet and sets body class name', () => {
      const spy = jest
        .spyOn(aesthetic, 'renderThemeStyles')
        .mockImplementation((theme) => `theme-${theme.name}`);

      expect(document.body.className).toBe('');

      aesthetic.changeTheme('night');

      expect(document.body.className).toBe('theme-night');

      expect(spy).toHaveBeenCalledWith(darkTheme);
    });

    it('emits `change:theme` event', () => {
      const spy = jest.fn();

      aesthetic.subscribe('change:theme', spy);
      aesthetic.changeTheme('night');

      expect(spy).toHaveBeenCalledWith('night');
    });

    it('doesnt emit `change:theme` event if `propagate` is false', () => {
      const spy = jest.fn();

      aesthetic.subscribe('change:theme', spy);
      aesthetic.changeTheme('night', false);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('configure()', () => {
    it('sets options', () => {
      expect(aesthetic.options).toEqual({
        defaultUnit: 'px',
        deterministicClasses: false,
        vendorPrefixes: false,
      });

      aesthetic.configure({
        defaultUnit: 'em',
        vendorPrefixes: true,
      });

      expect(aesthetic.options).toEqual({
        defaultUnit: 'em',
        deterministicClasses: false,
        vendorPrefixes: true,
      });
    });
  });

  describe('createComponentStyles()', () => {
    it('returns a `LocalSheet` instance', () => {
      expect(aesthetic.createComponentStyles(() => ({}))).toBeInstanceOf(LocalSheet);
    });
  });

  describe('createThemeStyles()', () => {
    it('returns a `GlobalSheet` instance', () => {
      expect(aesthetic.createThemeStyles(() => ({}))).toBeInstanceOf(GlobalSheet);
    });
  });

  describe('generateClassName()', () => {
    const classes = {
      a: { class: 'a', variants: { size_df: 'a_size_df' } },
      b: { class: 'b' },
      c: { class: 'c', variants: { size_md: 'c_size_md', type_red: 'c_size_red' } },
      d: { variants: { size_df: 'd_size_df' } },
      e: { class: 'e' },
      f: { class: 'f', variants: { size_df: 'f_size_df', size_md: 'f_size_md' } },
      g: { class: 'g', variants: { type_red: 'c_size_red' } },
    };

    it('returns class names', () => {
      expect(aesthetic.generateClassName(['a', 'e'], classes)).toBe('a e');
    });

    it('returns class names and their variants', () => {
      expect(aesthetic.generateClassName(['a', { size: 'df' }], classes)).toBe('a a_size_df');
      expect(aesthetic.generateClassName(['a', { size: 'df' }, 'f'], classes)).toBe(
        'a a_size_df f f_size_df',
      );
    });

    it('returns nothing for an invalid selector', () => {
      expect(aesthetic.generateClassName(['z'], classes)).toBe('');
    });

    it('returns nothing for a valid selector but no class name', () => {
      expect(aesthetic.generateClassName(['d'], classes)).toBe('');
    });

    it('returns variants even if theres no base class name', () => {
      expect(aesthetic.generateClassName(['d', { size: 'df' }], classes)).toBe('d_size_df');
    });

    it('subsequent variants override each other', () => {
      expect(
        aesthetic.generateClassName(['a', { size: 'df' }, 'f', 'b', { size: 'md' }, 'c'], classes),
      ).toBe('a f f_size_md b c c_size_md');
    });
  });

  describe('getActiveTheme()', () => {
    it('errors if no themes registered', () => {
      expect(() => {
        aesthetic.getActiveTheme();
      }).toThrow('No themes have been registered.');
    });

    it('returns the active theme defined by property', () => {
      const changeSpy = jest.spyOn(aesthetic, 'changeTheme');

      aesthetic.registerTheme('day', lightTheme);
      aesthetic.activeTheme = 'day';

      expect(aesthetic.getActiveTheme()).toBe(lightTheme);
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('returns the preferred theme if no active defined', () => {
      const getSpy = jest.spyOn(aesthetic.themeRegistry, 'getPreferredTheme');
      const changeSpy = jest.spyOn(aesthetic, 'changeTheme');

      setupAesthetic(aesthetic);

      expect(aesthetic.getActiveTheme()).toBe(lightTheme);
      expect(getSpy).toHaveBeenCalledWith();
      expect(changeSpy).toHaveBeenCalledWith('day');
    });
  });

  describe('getTheme()', () => {
    it('errors if not registered', () => {
      expect(() => {
        aesthetic.getTheme('unknown');
      }).toThrow('Theme "unknown" does not exist. Has it been registered?');
    });

    it('returns the theme defined by name', () => {
      aesthetic.registerTheme('day', lightTheme);

      expect(aesthetic.getTheme('day')).toBe(lightTheme);
    });
  });

  describe('hydrate()', () => {
    it('calls hydration on client renderer', () => {
      const spy = jest.spyOn(aesthetic.renderer as ClientRenderer, 'hydrateStyles');

      aesthetic.hydrate();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('registerDefaultTheme()', () => {
    it('registers a default theme', () => {
      const spy = jest.spyOn(aesthetic.themeRegistry, 'register');

      aesthetic.registerDefaultTheme('day', lightTheme);

      expect(spy).toHaveBeenCalledWith('day', lightTheme, true);
    });
  });

  describe('registerTheme()', () => {
    it('registers a theme', () => {
      const spy = jest.spyOn(aesthetic.themeRegistry, 'register');

      aesthetic.registerTheme('day', lightTheme);

      expect(spy).toHaveBeenCalledWith('day', lightTheme, false);
    });

    it('registers an optional sheet', () => {
      const sheet = aesthetic.createThemeStyles(() => ({}));

      aesthetic.registerTheme('day', lightTheme, sheet);

      expect(aesthetic.globalSheetRegistry.get('day')).toBe(sheet);
    });

    it('errors if sheet is not a `GlobalSheet` instance', () => {
      expect(() => {
        aesthetic.registerTheme(
          'day',
          lightTheme,
          // @ts-expect-error
          123,
        );
      }).toThrow('Rendering theme styles require a `GlobalSheet` instance.');
    });
  });

  describe('renderer()', () => {
    it('returns a client renderer by default', () => {
      expect(aesthetic.renderer).toBeInstanceOf(ClientRenderer);
    });

    it('passes a server renderer when wrapping for SSR', () => {
      const sr = new ServerRenderer();

      global.AESTHETIC_CUSTOM_RENDERER = sr;

      expect(aesthetic.renderer).toBe(sr);
    });
  });

  describe('renderComponentStyles()', () => {
    function createTempSheet() {
      return aesthetic.createComponentStyles(() => ({
        foo: {
          display: 'block',
        },
        bar: {
          color: 'black',

          '@variants': {
            type_red: {
              color: 'red',
            },
          },
        },
        baz: {
          position: 'absolute',
        },
      }));
    }

    beforeEach(() => {
      setupAesthetic(aesthetic);
    });

    it('errors if sheet is not a `LocalSheet` instance', () => {
      expect(() => {
        aesthetic.renderComponentStyles(
          // @ts-expect-error
          123,
        );
      }).toThrow('Rendering component styles require a `LocalSheet` instance.');
    });

    it('returns an empty object if no sheet selectors', () => {
      expect(aesthetic.renderComponentStyles(aesthetic.createComponentStyles(() => ({})))).toEqual(
        {},
      );
    });

    it('renders a sheet and returns an object class name', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      expect(aesthetic.renderComponentStyles(sheet)).toEqual({
        foo: { class: 'a' },
        bar: { class: 'c', variants: { type_red: 'b' } },
        baz: { class: 'd' },
      });
      expect(spy).toHaveBeenCalledWith(aesthetic.renderer, lightTheme, {
        unit: 'px',
        vendor: false,
      });
    });

    it('can customize params with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.configure({
        defaultUnit: 'em',
        vendorPrefixes: true,
      });

      aesthetic.renderComponentStyles(sheet, { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(aesthetic.renderer, lightTheme, {
        direction: 'rtl',
        unit: 'em',
        vendor: true,
      });
    });

    it('can customize theme with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.renderComponentStyles(sheet, { theme: 'night' });

      expect(spy).toHaveBeenCalledWith(aesthetic.renderer, darkTheme, {
        theme: 'night',
        unit: 'px',
        vendor: false,
      });
    });
  });

  describe('renderFontFace()', () => {
    it('passes to renderer', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderFontFace');
      const fontFace = {
        fontFamily: 'Roboto',
        src: "url('fonts/Roboto.woff2') format('woff2')",
      };

      aesthetic.renderFontFace(fontFace);

      expect(spy).toHaveBeenCalledWith(fontFace, undefined);

      spy.mockRestore();
    });

    it('supports SSS format', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderFontFace');

      aesthetic.renderFontFace(
        {
          srcPaths: ['fonts/Roboto.woff2'],
        },
        'Roboto',
      );

      expect(spy).toHaveBeenCalledWith(
        {
          fontFamily: 'Roboto',
          src: "url('fonts/Roboto.woff2') format('woff2')",
        },
        undefined,
      );

      spy.mockRestore();
    });
  });

  describe('renderImport()', () => {
    it('passes to renderer', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderImport');
      const path = 'url("test.css")';

      aesthetic.renderImport(path);

      expect(spy).toHaveBeenCalledWith(path);

      spy.mockRestore();
    });

    it('supports SSS format', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderImport');

      aesthetic.renderImport({
        path: 'test.css',
        url: true,
      });

      expect(spy).toHaveBeenCalledWith('url("test.css")');

      spy.mockRestore();
    });
  });

  describe('renderKeyframes()', () => {
    it('passes to renderer', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderKeyframes');
      const keyframes = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };

      aesthetic.renderKeyframes(keyframes);

      expect(spy).toHaveBeenCalledWith(keyframes, undefined, undefined);
    });

    it('can pass a name and params', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderKeyframes');
      const keyframes = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };

      aesthetic.renderKeyframes(keyframes, 'fade', { rtl: true });

      expect(spy).toHaveBeenCalledWith(keyframes, 'fade', { rtl: true });
    });
  });

  describe('renderThemeStyles()', () => {
    function createTempSheet() {
      return aesthetic.createThemeStyles(() => ({
        '@global': {
          display: 'block',
        },
      }));
    }

    it('returns an empty string if no theme sheet', () => {
      aesthetic.registerDefaultTheme('day', lightTheme);

      expect(aesthetic.renderThemeStyles(lightTheme)).toBe('');
    });

    it('renders a sheet and returns global class name', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.registerDefaultTheme('day', lightTheme, sheet);

      expect(aesthetic.renderThemeStyles(lightTheme)).toBe('cnneg4x');
      expect(spy).toHaveBeenCalledWith(aesthetic.renderer, lightTheme, {
        unit: 'px',
        vendor: false,
      });
    });

    it('can customize params with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.configure({
        defaultUnit: 'em',
        vendorPrefixes: true,
      });
      aesthetic.registerDefaultTheme('day', lightTheme, sheet);
      aesthetic.renderThemeStyles(lightTheme, { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(aesthetic.renderer, lightTheme, {
        direction: 'rtl',
        unit: 'em',
        vendor: true,
      });
    });
  });
});
