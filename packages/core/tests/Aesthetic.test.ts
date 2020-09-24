import directionConverter from '@aesthetic/addon-direction';
import vendorPrefixer from '@aesthetic/addon-vendor';
import { ClientRenderer } from '@aesthetic/style';
import { ServerRenderer } from '@aesthetic/style/server';
import {
  changeDirection,
  changeTheme,
  configure,
  createComponentStyles,
  createThemeStyles,
  generateClassName,
  getActiveDirection,
  getActiveTheme,
  getInternalsForTesting,
  getRenderer,
  getTheme,
  hydrate,
  registerDefaultTheme,
  registerTheme,
  renderComponentStyles,
  renderFontFace,
  renderImport,
  renderKeyframes,
  renderThemeStyles,
  StyleSheet,
  subscribe,
  unsubscribe,
} from '../src';
import { lightTheme, darkTheme, setupAesthetic, teardownAesthetic } from '../src/testing';

describe('Aesthetic', () => {
  beforeEach(() => {
    // @ts-expect-error Only need to mock matches
    window.matchMedia = () => ({ matches: false });
  });

  afterEach(() => {
    teardownAesthetic();
    document.documentElement.setAttribute('dir', 'ltr');
  });

  it('can subscribe and unsubscribe events', () => {
    const spy = jest.fn();

    subscribe('change:theme', spy);

    expect(getInternalsForTesting().listeners['change:theme']?.has(spy)).toBe(true);

    unsubscribe('change:theme', spy);

    expect(getInternalsForTesting().listeners['change:theme']?.has(spy)).toBe(false);
  });

  it('can subscribe and unsubscribe events using the return value', () => {
    const spy = jest.fn();

    const unsub = subscribe('change:theme', spy);

    expect(getInternalsForTesting().listeners['change:theme']?.has(spy)).toBe(true);

    unsub();

    expect(getInternalsForTesting().listeners['change:theme']?.has(spy)).toBe(false);
  });

  describe('changeDirection()', () => {
    beforeEach(() => {
      setupAesthetic();
    });

    it('sets active theme', () => {
      expect(getInternalsForTesting().activeDirection).toBeUndefined();

      changeDirection('rtl');

      expect(getInternalsForTesting().activeDirection).toBe('rtl');
    });

    it('doesnt run if changing to same name', () => {
      const spy = jest.fn();

      subscribe('change:direction', spy);

      changeDirection('rtl');
      changeDirection('rtl');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('sets document attribute', () => {
      document.documentElement.dir = 'ltr';

      expect(document.documentElement.dir).toBe('ltr');

      changeDirection('rtl');

      expect(document.documentElement.dir).toBe('rtl');
    });

    it('emits `change:direction` event', () => {
      const spy = jest.fn();

      subscribe('change:direction', spy);

      changeDirection('rtl');

      expect(spy).toHaveBeenCalledWith('rtl');
    });

    it('doesnt emit `change:direction` event if `propagate` is false', () => {
      const spy = jest.fn();

      subscribe('change:direction', spy);

      changeDirection('rtl', false);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('changeTheme()', () => {
    function createTempSheet() {
      return createThemeStyles(() => ({
        '@root': {
          display: 'block',
          color: 'black',
        },
      }));
    }

    beforeEach(() => {
      setupAesthetic();
    });

    it('sets active theme', () => {
      expect(getInternalsForTesting().activeTheme).toBeUndefined();

      changeTheme('night');

      expect(getInternalsForTesting().activeTheme).toBe('night');
    });

    it('doesnt run if changing to same name', () => {
      const spy = jest.spyOn(getRenderer(), 'applyRootVariables');

      changeTheme('night');
      changeTheme('night');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('applies root css variables', () => {
      const spy = jest.spyOn(getRenderer(), 'applyRootVariables');

      changeTheme('night');

      expect(spy).toHaveBeenCalledWith(darkTheme.toVariables());
    });

    it('renders theme sheet and sets body class name', () => {
      expect(document.body.className).toBe('');

      teardownAesthetic();
      registerTheme('night', darkTheme, createTempSheet());
      changeTheme('night');

      expect(document.body.className).toBe('cibrami');
    });

    it('emits `change:theme` event', () => {
      const spy = jest.fn();

      subscribe('change:theme', spy);
      changeTheme('night');

      expect(spy).toHaveBeenCalledWith('night');
    });

    it('doesnt emit `change:theme` event if `propagate` is false', () => {
      const spy = jest.fn();

      subscribe('change:theme', spy);
      changeTheme('night', false);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('configure()', () => {
    it('sets options', () => {
      expect(getInternalsForTesting().options).toEqual({
        defaultUnit: 'px',
        deterministicClasses: false,
        directionConverter: null,
        vendorPrefixer: null,
      });

      configure({
        defaultUnit: 'em',
        directionConverter,
        vendorPrefixer,
      });

      expect(getInternalsForTesting().options).toEqual({
        defaultUnit: 'em',
        deterministicClasses: false,
        directionConverter,
        vendorPrefixer,
      });
    });
  });

  describe('createComponentStyles()', () => {
    it('returns a `LocalSheet` instance', () => {
      expect(createComponentStyles(() => ({}))).toBeInstanceOf(StyleSheet);
    });
  });

  describe('createThemeStyles()', () => {
    it('returns a `GlobalSheet` instance', () => {
      expect(createThemeStyles(() => ({}))).toBeInstanceOf(StyleSheet);
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
      expect(generateClassName(['a', 'e'], [], classes)).toBe('a e');
    });

    it('returns class names and their variants', () => {
      expect(generateClassName(['a'], ['size_df'], classes)).toBe('a a_size_df');
      expect(generateClassName(['a', 'f'], ['size_df'], classes)).toBe('a a_size_df f f_size_df');
    });

    it('returns nothing for an invalid selector', () => {
      expect(generateClassName(['z'], [], classes)).toBe('');
    });

    it('returns nothing for a valid selector but no class name', () => {
      expect(generateClassName(['d'], [], classes)).toBe('');
    });

    it('returns variants even if theres no base class name', () => {
      expect(generateClassName(['d'], ['size_df'], classes)).toBe('d_size_df');
    });
  });

  describe('getActiveDirection()', () => {
    it('returns the direction defined on the html `dir` attribute', () => {
      const changeSpy = jest.fn();

      subscribe('change:direction', changeSpy);

      document.documentElement.setAttribute('dir', 'rtl');
      document.body.removeAttribute('dir');

      expect(getActiveDirection()).toBe('rtl');
      expect(changeSpy).toHaveBeenCalledWith('rtl');
    });

    it('returns the direction defined on the body `dir` attribute', () => {
      document.documentElement.removeAttribute('dir');
      document.body.setAttribute('dir', 'rtl');

      expect(getActiveDirection()).toBe('rtl');
    });

    it('returns ltr if no dir found', () => {
      document.documentElement.removeAttribute('dir');
      document.body.removeAttribute('dir');

      expect(getActiveDirection()).toBe('ltr');
    });

    it('caches result for subsequent lookups', () => {
      expect(getActiveDirection()).toBe('ltr');

      document.documentElement.setAttribute('dir', 'rtl');

      expect(getActiveDirection()).toBe('ltr');
    });
  });

  describe('getActiveTheme()', () => {
    it('errors if no themes registered', () => {
      expect(() => {
        getActiveTheme();
      }).toThrow('No themes have been registered.');
    });

    it('returns the active theme defined by property', () => {
      const changeSpy = jest.fn();

      subscribe('change:theme', changeSpy);
      setupAesthetic();
      changeTheme('night');

      expect(getActiveTheme()).toBe(darkTheme);
      expect(changeSpy).toHaveBeenCalledWith('night');
    });

    it('returns the preferred theme if no active defined', () => {
      const getSpy = jest.spyOn(getInternalsForTesting().themeRegistry, 'getPreferredTheme');
      const changeSpy = jest.fn();

      subscribe('change:theme', changeSpy);
      setupAesthetic();

      expect(getActiveTheme()).toBe(lightTheme);
      expect(getSpy).toHaveBeenCalledWith();
      expect(changeSpy).toHaveBeenCalledWith('day');
    });
  });

  describe('getTheme()', () => {
    it('errors if not registered', () => {
      expect(() => {
        getTheme('unknown');
      }).toThrow('Theme "unknown" does not exist. Has it been registered?');
    });

    it('returns the theme defined by name', () => {
      registerTheme('day', lightTheme);

      expect(getTheme('day')).toBe(lightTheme);
    });
  });

  describe('hydrate()', () => {
    it('calls hydration on client renderer', () => {
      const spy = jest.spyOn(getRenderer() as ClientRenderer, 'hydrateStyles');

      hydrate();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('registerDefaultTheme()', () => {
    it('registers a default theme', () => {
      const spy = jest.spyOn(getInternalsForTesting().themeRegistry, 'register');

      registerDefaultTheme('day', lightTheme);

      expect(spy).toHaveBeenCalledWith('day', lightTheme, true);
    });
  });

  describe('registerTheme()', () => {
    it('registers a theme', () => {
      const spy = jest.spyOn(getInternalsForTesting().themeRegistry, 'register');

      registerTheme('day', lightTheme);

      expect(spy).toHaveBeenCalledWith('day', lightTheme, false);
    });

    it('registers an optional sheet', () => {
      const sheet = createThemeStyles(() => ({}));

      registerTheme('day', lightTheme, sheet);

      expect(getInternalsForTesting().globalSheetRegistry.get('day')).toBe(sheet);
    });

    it('errors if sheet is not a `GlobalSheet` instance', () => {
      expect(() => {
        registerTheme(
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
      expect(getRenderer()).toBeInstanceOf(ClientRenderer);
    });

    it('passes a server renderer when wrapping for SSR', () => {
      const sr = new ServerRenderer();

      global.AESTHETIC_CUSTOM_RENDERER = sr;

      expect(getRenderer()).toBe(sr);
    });
  });

  describe('renderComponentStyles()', () => {
    function createTempSheet() {
      return createComponentStyles(() => ({
        foo: {
          display: 'block',
        },
        bar: {
          color: 'black',

          '@variants': {
            type: {
              red: {
                color: 'red',
              },
            },
          },
        },
        baz: {
          position: 'absolute',
        },
      }));
    }

    beforeEach(() => {
      setupAesthetic();
    });

    it('errors if sheet is not a `LocalSheet` instance', () => {
      expect(() => {
        renderComponentStyles(
          // @ts-expect-error
          123,
        );
      }).toThrow('Rendering component styles require a `LocalSheet` instance.');
    });

    it('returns an empty object if no sheet selectors', () => {
      expect(renderComponentStyles(createComponentStyles(() => ({})))).toEqual({});
    });

    it('renders a sheet and returns an object class name', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      expect(renderComponentStyles(sheet)).toEqual({
        foo: { class: 'a' },
        bar: { class: 'b', variants: { type_red: 'c' } },
        baz: { class: 'd' },
      });
      expect(spy).toHaveBeenCalledWith(getRenderer(), lightTheme, {
        direction: expect.any(String),
        unit: 'px',
        vendor: false,
      });
    });

    it('can customize params with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      configure({
        defaultUnit: 'em',
        vendorPrefixer,
      });

      renderComponentStyles(sheet, { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(getRenderer(), lightTheme, {
        direction: 'rtl',
        unit: 'em',
        vendor: true,
      });
    });

    it('can customize theme with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      renderComponentStyles(sheet, { theme: 'night' });

      expect(spy).toHaveBeenCalledWith(getRenderer(), darkTheme, {
        direction: expect.any(String),
        theme: 'night',
        unit: 'px',
        vendor: false,
      });
    });
  });

  describe('renderFontFace()', () => {
    it('passes to renderer', () => {
      const spy = jest.spyOn(getRenderer(), 'renderFontFace');
      const fontFace = {
        fontFamily: 'Roboto',
        src: "url('fonts/Roboto.woff2') format('woff2')",
      };

      renderFontFace(fontFace);

      expect(spy).toHaveBeenCalledWith(fontFace, undefined);

      spy.mockRestore();
    });

    it('supports SSS format', () => {
      const spy = jest.spyOn(getRenderer(), 'renderFontFace');

      renderFontFace(
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
      const spy = jest.spyOn(getRenderer(), 'renderImport');
      const path = 'url("test.css")';

      renderImport(path);

      expect(spy).toHaveBeenCalledWith(path);

      spy.mockRestore();
    });

    it('supports SSS format', () => {
      const spy = jest.spyOn(getRenderer(), 'renderImport');

      renderImport({
        path: 'test.css',
        url: true,
      });

      expect(spy).toHaveBeenCalledWith('url("test.css")');

      spy.mockRestore();
    });
  });

  describe('renderKeyframes()', () => {
    it('passes to renderer', () => {
      const spy = jest.spyOn(getRenderer(), 'renderKeyframes');
      const keyframes = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };

      renderKeyframes(keyframes);

      expect(spy).toHaveBeenCalledWith(keyframes, undefined, undefined);
    });

    it('can pass a name and params', () => {
      const spy = jest.spyOn(getRenderer(), 'renderKeyframes');
      const keyframes = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };

      renderKeyframes(keyframes, 'fade', { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(keyframes, 'fade', { direction: 'rtl' });
    });
  });

  describe('renderThemeStyles()', () => {
    function createTempSheet() {
      return createThemeStyles(() => ({
        '@root': {
          display: 'block',
          width: '100%',
        },
      }));
    }

    it('returns an empty string if no theme sheet', () => {
      registerDefaultTheme('day', lightTheme);

      expect(renderThemeStyles(lightTheme)).toBe('');
    });

    it('renders a sheet and returns global class name', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      registerDefaultTheme('day', lightTheme, sheet);

      expect(renderThemeStyles(lightTheme)).toBe('cg87bvm');
      expect(spy).toHaveBeenCalledWith(getRenderer(), lightTheme, {
        direction: expect.any(String),
        unit: 'px',
        vendor: false,
      });
    });

    it('can customize params with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      configure({
        defaultUnit: 'em',
        vendorPrefixer,
      });
      registerDefaultTheme('day', lightTheme, sheet);
      renderThemeStyles(lightTheme, { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(getRenderer(), lightTheme, {
        direction: 'rtl',
        unit: 'em',
        vendor: true,
      });
    });
  });
});
