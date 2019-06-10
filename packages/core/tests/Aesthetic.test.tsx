import Aesthetic from '../src/Aesthetic';
import StyleSheetManager from '../src/StyleSheetManager';
import { TestTheme, registerTestTheme, SYNTAX_GLOBAL } from '../src/testUtils';

describe('Aesthetic', () => {
  let instance: Aesthetic<TestTheme, any, any>;

  class TestAesthetic extends Aesthetic<TestTheme, any, any> {
    transformToClassName(styles: any[]): string {
      return styles.map((style, i) => `class-${i}`).join(' ');
    }
  }

  beforeEach(() => {
    instance = new TestAesthetic();

    registerTestTheme(instance);
  });

  describe('constructor()', () => {
    it('merges options', () => {
      instance = new TestAesthetic({
        stylesPropName: 'styleSheet',
      });

      expect(instance.options).toEqual({
        cxPropName: 'cx',
        extendable: false,
        passThemeProp: false,
        pure: true,
        rtl: false,
        stylesPropName: 'styleSheet',
        theme: 'default',
        themePropName: 'theme',
      });
    });

    it('sets `ltr` on document', () => {
      instance = new TestAesthetic({
        rtl: false,
      });

      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('sets `rtl` on document', () => {
      instance = new TestAesthetic({
        rtl: true,
      });

      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });
  });

  describe('applyGlobalStyles()', () => {
    it('does nothing if already applied', () => {
      const spy = jest.spyOn(instance, 'flushStyles');

      // @ts-ignore Allow override
      instance.appliedGlobals = true;
      instance.applyGlobalStyles({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('does nothing if no global styles defined for theme', () => {
      const spy = jest.spyOn(instance, 'parseStyleSheet');

      instance.globals.default = null;
      instance.applyGlobalStyles({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('processes global styles if defined for a theme', () => {
      const spy = jest.spyOn(instance, 'parseStyleSheet');

      instance.applyGlobalStyles({});

      expect(spy).toHaveBeenCalledWith({}, ':root');
    });
  });

  describe('changeTheme()', () => {
    it('errors for invalid theme name', () => {
      expect(() => {
        instance.changeTheme('unknown');
      }).toThrowErrorMatchingSnapshot();
    });

    it('changes the theme option', () => {
      expect(instance.options.theme).toBe('default');

      instance.changeTheme('light');

      expect(instance.options.theme).toBe('light');
    });

    it('purges all styles', () => {
      const spy = jest.spyOn(instance, 'purgeStyles');

      instance.changeTheme('light');

      expect(spy).toHaveBeenCalled();
    });

    it('resets and applies global styles', () => {
      const spy = jest.spyOn(instance, 'applyGlobalStyles');

      instance.changeTheme('light');

      expect(spy).toHaveBeenCalledWith({ rtl: false });
    });

    it('clears cache', () => {
      instance.cache.foo = {};

      instance.changeTheme('light');

      expect(instance.cache).toEqual({});
    });
  });

  // Will have no properties as no unified syntax handlers are defined
  describe('createStyleSheet()', () => {
    beforeEach(() => {
      instance.registerStyleSheet('foo', ({ unit }: TestTheme) => ({
        el: {
          display: 'block',
          padding: unit,
          color: 'black',
        },
      }));
    });

    it('returns the style sheet', () => {
      expect(instance.createStyleSheet('foo', {})).toEqual({
        el: {},
      });
    });

    it('calls `convertStyleSheet` for unified syntax while passing theme', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith(
        {
          el: {
            display: 'block',
            padding: 8,
            color: 'black',
          },
        },
        { name: 'foo', rtl: false },
      );
    });

    it('calls `parseStyleSheet` with converted syntax', () => {
      const spy = jest.spyOn(instance, 'parseStyleSheet');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith({ el: {} }, 'foo');
    });

    it('calls `applyGlobalStyles`', () => {
      const spy = jest.spyOn(instance, 'applyGlobalStyles');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalled();
    });

    it('caches the result', () => {
      expect(instance.cache.foo).toBeUndefined();

      instance.createStyleSheet('foo', {});

      expect(instance.cache.foo).toEqual({ el: {} });

      const sheet = instance.createStyleSheet('foo', {});

      expect(instance.cache.foo).toEqual(sheet);
    });

    it('inherits `rtl` from passed options', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.options.rtl = true;
      instance.createStyleSheet('foo', { rtl: false });

      expect(spy).toHaveBeenCalledWith(expect.anything(), { name: 'foo', rtl: false });
    });

    it('inherits `rtl` from `Aesthetic` option', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.options.rtl = true;
      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith(expect.anything(), { name: 'foo', rtl: true });
    });
  });

  describe('extendStyles()', () => {
    it('returns a stylesheet', () => {
      const styleSheet = instance.extendStyles(() => ({ element: { display: 'block' } }));

      expect(typeof styleSheet).toBe('function');
      expect(styleSheet({ color: 'black', unit: 8 })).toEqual({ element: { display: 'block' } });
    });

    it('passes theme variables', () => {
      const styleSheet = instance.extendStyles(theme => ({
        element: { padding: theme.unit },
      }));

      expect(styleSheet({ color: 'black', unit: 8 })).toEqual({ element: { padding: 8 } });
    });

    it('deep merges multiple stylesheets', () => {
      const styleSheet = instance.extendStyles(
        theme => ({ element: { padding: theme.unit } }),
        () => ({ element: { display: 'block' } }),
        ({ color }) => ({ elementActive: { color } }),
      );

      expect(styleSheet({ unit: 8, color: 'red' })).toEqual({
        element: { padding: 8, display: 'block' },
        elementActive: { color: 'red' },
      });
    });
  });

  describe('extendTheme()', () => {
    it('errors if the parent theme doesnt exist', () => {
      expect(() => instance.extendTheme('bar', 'foo', {})).toThrowErrorMatchingSnapshot();
    });

    it('deep merges the parent and child theme', () => {
      instance.registerTheme('foo', {
        color: 'red',
        unit: 8,
      });

      instance.extendTheme('bar', 'foo', {
        color: 'blue',
      });

      expect(instance.themes.bar).toEqual({
        color: 'blue',
        unit: 8,
      });
    });

    it('inherits parent theme global styles', () => {
      const spy = jest.fn();

      instance.registerTheme('foo', { color: 'red', unit: 8 }, spy);
      instance.extendTheme('bar', 'foo', {});

      expect(instance.globals.bar).toBe(spy);
    });
  });

  describe('getStyleSheet()', () => {
    beforeEach(() => {
      instance.registerStyleSheet('foo', () => ({
        el: { display: 'block' },
      }));
    });

    it('errors if no theme', () => {
      instance.options.theme = 'unknown';

      expect(() => {
        instance.getStyleSheet('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the style sheet', () => {
      expect(instance.getStyleSheet('foo')).toEqual({
        el: { display: 'block' },
      });
    });

    it('passes theme to the style callback', () => {
      instance.registerStyleSheet('bar', theme => ({
        el: { padding: theme.unit * 2 },
      }));

      expect(instance.getStyleSheet('bar')).toEqual({
        el: { padding: 16 },
      });
    });

    it('inherits styles from parent', () => {
      instance.registerStyleSheet('bar', () => ({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      }));

      instance.registerStyleSheet(
        'baz',
        () => ({
          el: {
            background: 'blue',
            ':hover': {
              color: 'green',
            },
          },
        }),
        'bar',
      );

      instance.registerStyleSheet(
        'qux',
        () => ({
          el: { display: 'block' },
        }),
        'baz',
      );

      expect(instance.getStyleSheet('bar')).toEqual({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      });

      expect(instance.getStyleSheet('baz')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          ':hover': {
            color: 'green',
          },
        },
      });

      expect(instance.getStyleSheet('qux')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          display: 'block',
          ':hover': {
            color: 'green',
          },
        },
      });
    });
  });

  describe('getStyleSheetManager', () => {
    it('returns and sets a style sheet manager', () => {
      // @ts-ignore Allow access
      expect(instance.sheetManager).toBeNull();

      // @ts-ignore Allow access
      const manager = instance.getStyleSheetManager();

      // @ts-ignore Allow access
      expect(instance.sheetManager).not.toBeNull();
      expect(manager).toBeInstanceOf(StyleSheetManager);
    });
  });

  describe('getTheme()', () => {
    it('errors if the theme doesnt exist', () => {
      expect(() => {
        instance.getTheme('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if the theme is not an object', () => {
      // @ts-ignore Allow invalid type
      instance.themes.default = 123;

      expect(() => {
        instance.getTheme();
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the default theme if no name provided', () => {
      expect(instance.getTheme()).toEqual({ color: 'black', unit: 8 });
    });

    it('returns the theme by name', () => {
      expect(instance.getTheme('default')).toEqual({ color: 'black', unit: 8 });
    });
  });

  describe('parseStyleSheet()', () => {
    it('returns the style sheet as an object', () => {
      const sheet = { el: {} };
      const styleSheet = instance.parseStyleSheet(sheet, 'styleName');

      expect(sheet).toEqual(styleSheet);
    });
  });

  describe('registerTheme()', () => {
    it('errors if a theme name has been used', () => {
      expect(() =>
        instance.registerTheme(
          'default',
          // @ts-ignore Allow empty
          {},
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if a theme style is not an object', () => {
      expect(() =>
        instance.registerTheme(
          'foo',
          // @ts-ignore Allow invalid type
          123,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if global styles is not an object', () => {
      expect(() =>
        instance.registerTheme(
          'foo',
          // @ts-ignore Allow empty
          {},
          // @ts-ignore Allow non-object
          123,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('registers theme and sets global styles', () => {
      expect(instance.globals.foo).toBeUndefined();

      instance.registerTheme('foo', { color: 'red', unit: 6 }, () => SYNTAX_GLOBAL);

      expect(instance.themes.foo).toEqual({ color: 'red', unit: 6 });

      expect(instance.globals.foo).toBeDefined();
    });
  });

  describe('registerStyleSheet()', () => {
    it('errors if styles have been set', () => {
      instance.styles.foo = () => ({});

      expect(() => {
        instance.registerStyleSheet('foo', () => ({}));
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles try to extend from itself', () => {
      instance.styles.foo = () => ({});

      expect(() => {
        instance.registerStyleSheet('foo', () => ({}), 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles are not a function', () => {
      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          123,
        ),
      ).toThrowErrorMatchingSnapshot();

      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          'abc',
        ),
      ).toThrowErrorMatchingSnapshot();

      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          [],
        ),
      ).toThrowErrorMatchingSnapshot();

      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          true,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if extended styles do not exist', () => {
      expect(() =>
        instance.registerStyleSheet('foo', () => ({}), 'parent'),
      ).toThrowErrorMatchingSnapshot();
    });

    it('sets styles', () => {
      expect(instance.styles.foo).toBeUndefined();

      instance.registerStyleSheet('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      expect(instance.styles.foo).toBeDefined();
    });

    it('sets styles and extends parents', () => {
      expect(instance.styles.bar).toBeUndefined();
      expect(instance.parents.bar).toBeUndefined();

      instance.registerStyleSheet('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      instance.registerStyleSheet(
        'bar',
        () => ({
          child: { margin: 5 },
        }),
        'foo',
      );

      expect(instance.parents.bar).toBe('foo');
    });
  });

  describe('transformStyles()', () => {
    it('errors for invalid value', () => {
      expect(() => {
        instance.transformStyles(
          // @ts-ignore Allow invalid type
          [123],
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('combines strings into a class name', () => {
      expect(instance.transformStyles(['foo', 'bar'], {})).toBe('foo bar');
    });

    it('calls `transformToClassName` method', () => {
      const spy = jest.spyOn(instance, 'transformToClassName');

      instance.transformStyles([{ color: 'red' }, { display: 'block' }], {});

      expect(spy).toHaveBeenCalledWith([{ color: 'red' }, { display: 'block' }]);
    });

    it('ignores falsey values', () => {
      expect(instance.transformStyles([null, false, 0, '', undefined], {})).toBe('');
    });

    it('strips period prefix', () => {
      expect(instance.transformStyles(['.foo', 'bar .qux'], {})).toBe('foo bar qux');
    });

    it('handles expression values', () => {
      expect(instance.transformStyles(['foo', true && 'bar', 5 > 10 && 'baz'], {})).toBe('foo bar');
    });

    it('joins strings', () => {
      expect(instance.transformStyles(['foo', '123', 'bar'], {})).toBe('foo 123 bar');
    });

    it('parses and flushes inline style objects', () => {
      const processSpy = jest.spyOn(instance, 'parseStyleSheet');
      const flushSpy = jest.spyOn(instance, 'flushStyles');

      // @ts-ignore
      instance.isParsedBlock = () => false;
      instance.transformStyles([{ color: 'red' }, { display: 'block' }], {});

      expect(processSpy).toHaveBeenCalledWith(
        {
          'inline-0': { color: 'red' },
          'inline-1': { display: 'block' },
        },
        expect.anything(),
      );
      expect(flushSpy).toHaveBeenCalledWith(expect.anything());
    });
  });
});
