import directionConverter from '@aesthetic/addon-direction';
import vendorPrefixer from '@aesthetic/addon-vendor';
import { createServerEngine } from '@aesthetic/style/lib/server';
import { Aesthetic, StyleSheet } from '../src';
import {
  lightTheme,
  darkTheme,
  setupAesthetic,
  teardownAesthetic,
  getAestheticState,
} from '../src/test';

describe('Aesthetic', () => {
  let aesthetic: Aesthetic;

  beforeEach(() => {
    aesthetic = new Aesthetic();
    aesthetic.configureEngine(createServerEngine());
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
    document.documentElement.setAttribute('dir', 'ltr');
  });

  it('can subscribe and unsubscribe events', () => {
    const spy = jest.fn();

    aesthetic.subscribe('change:theme', spy);

    expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(true);

    aesthetic.unsubscribe('change:theme', spy);

    expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(false);
  });

  it('can subscribe and unsubscribe events using the return value', () => {
    const spy = jest.fn();

    const unsub = aesthetic.subscribe('change:theme', spy);

    expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(true);

    unsub();

    expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(false);
  });

  describe('changeDirection()', () => {
    beforeEach(() => {
      setupAesthetic(aesthetic);

      // @ts-expect-error
      aesthetic.activeDirection.reset();
    });

    it('sets active direction', () => {
      expect(getAestheticState(aesthetic).activeDirection).toBeUndefined();

      aesthetic.changeDirection('rtl');

      expect(getAestheticState(aesthetic).activeDirection).toBe('rtl');
    });

    it('doesnt run if changing to same name', () => {
      const spy = jest.fn();

      aesthetic.subscribe('change:direction', spy);

      aesthetic.changeDirection('rtl');
      aesthetic.changeDirection('rtl');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('sets document attribute', () => {
      document.documentElement.dir = 'ltr';

      expect(document.documentElement.dir).toBe('ltr');

      aesthetic.changeDirection('rtl');

      expect(document.documentElement.dir).toBe('rtl');
    });

    it('emits `change:direction` event', () => {
      const spy = jest.fn();

      aesthetic.subscribe('change:direction', spy);

      aesthetic.changeDirection('rtl');

      expect(spy).toHaveBeenCalledWith('rtl');
    });

    it('doesnt emit `change:direction` event if `propagate` is false', () => {
      const spy = jest.fn();

      aesthetic.subscribe('change:direction', spy);

      aesthetic.changeDirection('rtl', false);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('changeTheme()', () => {
    function createTempSheet() {
      return aesthetic.createThemeStyles(() => ({
        '@root': {
          display: 'block',
          color: 'black',
        },
      }));
    }

    beforeEach(() => {
      setupAesthetic(aesthetic);
    });

    it('sets active theme', () => {
      expect(getAestheticState(aesthetic).activeTheme).toBeUndefined();

      aesthetic.changeTheme('night');

      expect(getAestheticState(aesthetic).activeTheme).toBe('night');
    });

    it('doesnt run if changing to same name', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'setRootVariables');

      aesthetic.changeTheme('night');
      aesthetic.changeTheme('night');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('applies root css variables', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'setRootVariables');

      aesthetic.changeTheme('night');

      expect(spy).toHaveBeenCalledWith(darkTheme.toVariables());
    });

    it('renders theme sheet and sets body class name', () => {
      expect(document.body.className).toBe('');

      teardownAesthetic(aesthetic);

      aesthetic.configureEngine(createServerEngine());
      aesthetic.registerTheme('night', darkTheme, createTempSheet());

      aesthetic.changeTheme('night');

      expect(document.body.className).toBe('c1a6vqom');
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
      expect(getAestheticState(aesthetic).options).toEqual({});

      aesthetic.configure({
        defaultUnit: 'em',
        directionConverter,
        vendorPrefixer,
      });

      expect(getAestheticState(aesthetic).options).toEqual({
        defaultUnit: 'em',
        directionConverter,
        vendorPrefixer,
      });
    });
  });

  describe('createComponentStyles()', () => {
    beforeEach(() => {
      setupAesthetic(aesthetic);
    });

    it('returns a `LocalSheet` instance', () => {
      expect(aesthetic.createComponentStyles(() => ({}))).toBeInstanceOf(StyleSheet);
    });

    it('renders styles immediately upon creation', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'renderDeclaration');

      aesthetic.createComponentStyles(() => ({
        element: {
          display: 'block',
          width: '100%',
        },
      }));

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('createThemeStyles()', () => {
    it('returns a `GlobalSheet` instance', () => {
      expect(aesthetic.createThemeStyles(() => ({}))).toBeInstanceOf(StyleSheet);
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
      expect(aesthetic.generateClassName(['a', 'e'], [], classes)).toBe('a e');
    });

    it('returns class names and their variants', () => {
      expect(aesthetic.generateClassName(['a'], ['size_df'], classes)).toBe('a a_size_df');
      expect(aesthetic.generateClassName(['a', 'f'], ['size_df'], classes)).toBe(
        'a a_size_df f f_size_df',
      );
    });

    it('returns nothing for an invalid selector', () => {
      expect(aesthetic.generateClassName(['z'], [], classes)).toBe('');
    });

    it('returns nothing for a valid selector but no class name', () => {
      expect(aesthetic.generateClassName(['d'], [], classes)).toBe('');
    });

    it('returns variants even if theres no base class name', () => {
      expect(aesthetic.generateClassName(['d'], ['size_df'], classes)).toBe('d_size_df');
    });
  });

  describe('getActiveDirection()', () => {
    beforeEach(() => {
      // @ts-expect-error
      aesthetic.activeDirection.reset();
    });

    it('returns the direction defined on the html `dir` attribute', () => {
      const changeSpy = jest.fn();

      aesthetic.subscribe('change:direction', changeSpy);

      document.documentElement.setAttribute('dir', 'rtl');
      document.body.removeAttribute('dir');

      expect(aesthetic.getActiveDirection()).toBe('rtl');
      expect(changeSpy).toHaveBeenCalledWith('rtl');
    });

    it('returns the direction defined on the body `dir` attribute', () => {
      document.documentElement.removeAttribute('dir');
      document.body.setAttribute('dir', 'rtl');

      expect(aesthetic.getActiveDirection()).toBe('rtl');
    });

    it('returns ltr if no dir found', () => {
      document.documentElement.removeAttribute('dir');
      document.body.removeAttribute('dir');

      expect(aesthetic.getActiveDirection()).toBe('ltr');
    });

    it('caches result for subsequent lookups', () => {
      expect(aesthetic.getActiveDirection()).toBe('ltr');

      document.documentElement.setAttribute('dir', 'rtl');

      expect(aesthetic.getActiveDirection()).toBe('ltr');
    });
  });

  describe('getActiveTheme()', () => {
    it('errors if no themes registered', () => {
      expect(() => {
        aesthetic.getActiveTheme();
      }).toThrow('No themes have been registered.');
    });

    it('returns the active theme defined by property', () => {
      const changeSpy = jest.fn();

      aesthetic.subscribe('change:theme', changeSpy);
      setupAesthetic(aesthetic);
      aesthetic.changeTheme('night');

      expect(aesthetic.getActiveTheme()).toBe(darkTheme);
      expect(changeSpy).toHaveBeenCalledWith('night');
    });

    it('returns the preferred theme if no active defined', () => {
      const getSpy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'getPreferredTheme');
      const changeSpy = jest.fn();

      aesthetic.subscribe('change:theme', changeSpy);
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

  describe('registerDefaultTheme()', () => {
    it('registers a default theme', () => {
      const spy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'register');

      aesthetic.registerDefaultTheme('day', lightTheme);

      expect(spy).toHaveBeenCalledWith('day', lightTheme, true);
    });
  });

  describe('registerTheme()', () => {
    it('registers a theme', () => {
      const spy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'register');

      aesthetic.registerTheme('day', lightTheme);

      expect(spy).toHaveBeenCalledWith('day', lightTheme, false);
    });

    it('registers an optional sheet', () => {
      const sheet = aesthetic.createThemeStyles(() => ({}));

      aesthetic.registerTheme('day', lightTheme, sheet);

      expect(getAestheticState(aesthetic).globalSheetRegistry.get('day')).toBe(sheet);
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

  describe('getEngine()', () => {
    it('returns a client engine by default', () => {
      expect(aesthetic.getEngine()).toBeDefined();
    });

    it('can define a custom engine by using a global variable', () => {
      const customEngine = createServerEngine();

      global.AESTHETIC_CUSTOM_ENGINE = customEngine;

      expect(aesthetic.getEngine()).toBe(customEngine);
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
        bar: { class: 'b', variants: { type_red: 'c' } },
        baz: { class: 'd' },
      });
      expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
        direction: expect.any(String),
        vendor: false,
      });
    });

    it('can customize params with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.configure({
        defaultUnit: 'em',
        vendorPrefixer,
      });

      aesthetic.renderComponentStyles(sheet, { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
        direction: 'rtl',
        vendor: true,
      });
    });

    it('can customize theme with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.renderComponentStyles(sheet, { theme: 'night' });

      expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), darkTheme, {
        direction: expect.any(String),
        theme: 'night',
        vendor: false,
      });
    });
  });

  describe('renderFontFace()', () => {
    it('passes to engine', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'renderFontFace');
      const fontFace = {
        fontFamily: 'Roboto',
        src: "url('fonts/Roboto.woff2') format('woff2')",
      };

      aesthetic.renderFontFace(fontFace);

      expect(spy).toHaveBeenCalledWith(fontFace, undefined);

      spy.mockRestore();
    });

    it('supports SSS format', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'renderFontFace');

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
    it('passes to engine', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'renderImport');
      const path = 'test.css';

      aesthetic.renderImport(path);

      expect(spy).toHaveBeenCalledWith(path, undefined);

      spy.mockRestore();
    });
  });

  describe('renderKeyframes()', () => {
    it('passes to engine', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'renderKeyframes');
      const keyframes = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };

      aesthetic.renderKeyframes(keyframes);

      expect(spy).toHaveBeenCalledWith(keyframes, undefined, undefined);
    });

    it('can pass a name and params', () => {
      const spy = jest.spyOn(aesthetic.getEngine(), 'renderKeyframes');
      const keyframes = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };

      aesthetic.renderKeyframes(keyframes, 'fade', { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(keyframes, 'fade', { direction: 'rtl' });
    });
  });

  describe('renderThemeStyles()', () => {
    function createTempSheet() {
      return aesthetic.createThemeStyles(() => ({
        '@root': {
          display: 'block',
          width: '100%',
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

      expect(aesthetic.renderThemeStyles(lightTheme)).toBe('csw78m6');
      expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
        direction: expect.any(String),
        vendor: false,
      });
    });

    it('can customize params with options', () => {
      const sheet = createTempSheet();
      const spy = jest.spyOn(sheet, 'render');

      aesthetic.configure({
        defaultUnit: 'em',
        vendorPrefixer,
      });
      aesthetic.registerDefaultTheme('day', lightTheme, sheet);
      aesthetic.renderThemeStyles(lightTheme, { direction: 'rtl' });

      expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
        direction: 'rtl',
        vendor: true,
      });
    });
  });
});
