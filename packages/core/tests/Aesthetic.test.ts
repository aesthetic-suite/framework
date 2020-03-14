import { ClientRenderer } from '@aesthetic/style';
import Aesthetic from '../src/Aesthetic';
import { LocalSheet, GlobalSheet } from '../src';
import { lightTheme, darkTheme, setupAesthetic, teardownAesthetic } from '../src/testing';

describe('Aesthetic', () => {
  let aesthetic: Aesthetic;

  beforeEach(() => {
    aesthetic = new Aesthetic();

    // @ts-ignore Only need to mock matches
    window.matchMedia = () => ({ matches: false });
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  it('can subscribe and unsubscribe events', () => {
    const spy = jest.fn();

    aesthetic.subscribe('change:theme', spy);

    // @ts-ignore Allow
    expect(aesthetic.listeners['change:theme'].has(spy)).toBe(true);

    aesthetic.unsubscribe('change:theme', spy);

    // @ts-ignore Allow
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
        .mockImplementation(theme => `theme-${theme.name}`);

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

      // @ts-ignore Allow
      expect(aesthetic.globalSheetRegistry.get('day')).toBe(sheet);
    });

    it('errors if sheet is not a `GlobalSheet` instance', () => {
      expect(() => {
        aesthetic.registerTheme(
          'day',
          lightTheme,
          // @ts-ignore Allow
          123,
        );
      }).toThrow('Rendering theme styles require a `GlobalSheet` instance.');
    });
  });

  describe('renderer()', () => {
    it('returns a client renderer by default', () => {
      expect(aesthetic.renderer).toBeInstanceOf(ClientRenderer);
    });

    // it('passes a server renderer when wrapping for SSR', () => {
    //   const sr = new ServerRenderer();

    //   captureStyles(sr, () => aesthetic.renderer);

    //   expect(aesthetic.renderer).toBe(sr);
    // });
  });

  describe('renderComponentStyles()', () => {
    function createTempSheet() {
      return aesthetic.createComponentStyles(() => ({
        foo: {
          display: 'block',
        },
        bar: {
          color: 'black',
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
          // @ts-ignore Allow
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
        foo: 'a',
        bar: 'b',
        baz: 'c',
      });
      expect(spy).toHaveBeenCalledWith(aesthetic.renderer, lightTheme, {
        prefix: false,
        unit: 'px',
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
        prefix: true,
        unit: 'em',
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

      expect(spy).toHaveBeenCalledWith(fontFace);
    });
  });

  describe('renderImport()', () => {
    it('passes to renderer', () => {
      const spy = jest.spyOn(aesthetic.renderer, 'renderImport');
      const path = 'url("test.css")';

      aesthetic.renderImport(path);

      expect(spy).toHaveBeenCalledWith(path);
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
        prefix: false,
        unit: 'px',
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
        prefix: true,
        unit: 'em',
      });
    });
  });
});
