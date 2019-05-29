import { StyleSheetTestUtils } from 'aphrodite';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { create } from 'jss';
// @ts-ignore
import preset from 'jss-preset-default';
import { TypeStyle } from 'typestyle';
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import CSSModulesAesthetic from 'aesthetic-adapter-css-modules';
import FelaAesthetic from 'aesthetic-adapter-fela';
import JSSAesthetic from 'aesthetic-adapter-jss';
import TypeStyleAesthetic from 'aesthetic-adapter-typestyle';
import Aesthetic from '../src/Aesthetic';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
import StyleSheetManager from '../src/StyleSheetManager';
import {
  TestAesthetic,
  registerTestTheme,
  SYNTAX_GLOBAL,
  SYNTAX_UNIFIED_LOCAL_FULL,
} from '../src/testUtils';

describe('Aesthetic', () => {
  let instance: Aesthetic<any, any, any>;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();

    instance = new TestAesthetic();

    registerTestTheme(instance);
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
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
      // @ts-ignore Allow access
      const spy = jest.spyOn(instance, 'processStyleSheet');

      instance.globals.default = null;
      instance.applyGlobalStyles({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('processes global styles if defined for a theme', () => {
      // @ts-ignore Allow access
      const spy = jest.spyOn(instance, 'processStyleSheet');

      instance.applyGlobalStyles({});

      expect(spy).toHaveBeenCalledWith({}, ':root');
    });
  });

  // Will have no properties as no unified syntax handlers are defined
  describe('createStyleSheet()', () => {
    beforeEach(() => {
      // @ts-ignore Allow access
      instance.setStyleSheet('foo', ({ unit }) => ({
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
        { name: 'foo' },
      );
    });

    it('calls `processStyleSheet` with converted syntax', () => {
      // @ts-ignore Allow access
      const spy = jest.spyOn(instance, 'processStyleSheet');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith({ el: {} }, 'foo');
    });

    it('calls `applyGlobalStyles`', () => {
      // @ts-ignore Allow access
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
  });

  describe('extendStyles()', () => {
    it('returns a stylesheet', () => {
      const styleSheet = instance.extendStyles(() => ({ element: { display: 'block' } }));

      expect(typeof styleSheet).toBe('function');
      expect(styleSheet({})).toEqual({ element: { display: 'block' } });
    });

    it('passes theme variables', () => {
      const styleSheet = instance.extendStyles(theme => ({ element: { padding: theme.unit } }));

      expect(styleSheet({ unit: 8 })).toEqual({ element: { padding: 8 } });
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
        unit: 'px',
        unitSize: 8,
        colors: {
          primary: 'red',
        },
      });

      instance.extendTheme('bar', 'foo', {
        unit: 'em',
        colors: {
          primary: 'blue',
          secondary: 'orange',
        },
      });

      expect(instance.themes.bar).toEqual({
        unit: 'em',
        unitSize: 8,
        colors: {
          primary: 'blue',
          secondary: 'orange',
        },
      });
    });

    it('inherits parent theme global styles', () => {
      const spy = jest.fn();

      instance.registerTheme('foo', {}, spy);
      instance.extendTheme('bar', 'foo', {});

      expect(instance.globals.bar).toBe(spy);
    });
  });

  describe('getStyleSheet()', () => {
    beforeEach(() => {
      // @ts-ignore Allow access
      instance.setStyleSheet('foo', () => ({
        el: { display: 'block' },
      }));
    });

    it('errors if no theme', () => {
      instance.options.theme = 'unknown';

      expect(() => {
        // @ts-ignore Allow access
        instance.getStyleSheet('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the style sheet', () => {
      // @ts-ignore Allow access
      expect(instance.getStyleSheet('foo')).toEqual({
        el: { display: 'block' },
      });
    });

    it('passes theme to the style callback', () => {
      // @ts-ignore Allow access
      instance.setStyleSheet('bar', theme => ({
        el: { padding: theme.unit * 2 },
      }));

      // @ts-ignore Allow access
      expect(instance.getStyleSheet('bar')).toEqual({
        el: { padding: 16 },
      });
    });

    it('inherits styles from parent', () => {
      // @ts-ignore Allow access
      instance.setStyleSheet('bar', () => ({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      }));

      // @ts-ignore Allow access
      instance.setStyleSheet(
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

      // @ts-ignore Allow access
      instance.setStyleSheet(
        'qux',
        () => ({
          el: { display: 'block' },
        }),
        'baz',
      );

      // @ts-ignore Allow access
      expect(instance.getStyleSheet('bar')).toEqual({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      });

      // @ts-ignore Allow access
      expect(instance.getStyleSheet('baz')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          ':hover': {
            color: 'green',
          },
        },
      });

      // @ts-ignore Allow access
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
        // @ts-ignore Allow access
        instance.getTheme('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if the theme is not an object', () => {
      instance.themes.default = 123;

      expect(() => {
        // @ts-ignore Allow access
        instance.getTheme();
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the default theme if no name provided', () => {
      // @ts-ignore Allow access
      expect(instance.getTheme()).toEqual({ unit: 8 });
    });

    it('returns the theme by name', () => {
      // @ts-ignore Allow access
      expect(instance.getTheme('default')).toEqual({ unit: 8 });
    });
  });

  describe('processStyleSheet()', () => {
    it('returns the style sheet as an object', () => {
      const sheet = { el: {} };
      // @ts-ignore Allow access
      const styleSheet = instance.processStyleSheet(sheet, 'styleName');

      expect(sheet).toEqual(styleSheet);
    });
  });

  describe('registerTheme()', () => {
    it('errors if a theme name has been used', () => {
      expect(() => instance.registerTheme('default', {})).toThrowErrorMatchingSnapshot();
    });

    it('errors if a theme style is not an object', () => {
      expect(() => instance.registerTheme('foo', 123)).toThrowErrorMatchingSnapshot();
    });

    it('errors if global styles is not an object', () => {
      // @ts-ignore Allow non-object
      expect(() => instance.registerTheme('foo', {}, 123)).toThrowErrorMatchingSnapshot();
    });

    it('registers theme and sets global styles', () => {
      expect(instance.globals.foo).toBeUndefined();

      instance.registerTheme('foo', { unitSize: 6 }, () => SYNTAX_GLOBAL);

      expect(instance.themes.foo).toEqual({ unitSize: 6 });

      expect(instance.globals.foo).toBeDefined();
    });
  });

  describe('setStyleSheet()', () => {
    it('errors if styles have been set', () => {
      instance.styles.foo = () => ({});

      expect(() => {
        // @ts-ignore Allow access
        instance.setStyleSheet('foo', () => ({}));
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles try to extend from itself', () => {
      instance.styles.foo = () => ({});

      expect(() => {
        // @ts-ignore Allow access
        instance.setStyleSheet('foo', () => ({}), 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles are not a function', () => {
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyleSheet('foo', 123)).toThrowErrorMatchingSnapshot();
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyleSheet('foo', 'abc')).toThrowErrorMatchingSnapshot();
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyleSheet('foo', [])).toThrowErrorMatchingSnapshot();
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyleSheet('foo', true)).toThrowErrorMatchingSnapshot();
    });

    it('errors if extended styles do not exist', () => {
      expect(() =>
        // @ts-ignore Allow access
        instance.setStyleSheet('foo', () => ({}), 'parent'),
      ).toThrowErrorMatchingSnapshot();
    });

    it('sets styles', () => {
      expect(instance.styles.foo).toBeUndefined();

      // @ts-ignore Allow access
      instance.setStyleSheet('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      expect(instance.styles.foo).toBeDefined();
    });

    it('sets styles and extends parents', () => {
      expect(instance.styles.bar).toBeUndefined();
      expect(instance.parents.bar).toBeUndefined();

      // @ts-ignore Allow access
      instance.setStyleSheet('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      // @ts-ignore Allow access
      instance.setStyleSheet(
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
      // @ts-ignore Allow access
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
  });

  describe('adapters', () => {
    it('supports class names', () => {
      const adapter = new ClassNameAesthetic();
      adapter.registerTheme('default', {});
      // @ts-ignore Allow access
      adapter.setStyleSheet('foo', () => ({ button: 'button' }));

      const styleSheet = adapter.createStyleSheet('foo', {});

      expect(adapter.transformStyles([styleSheet.button], {})).toMatchSnapshot();
    });

    it('supports Aphrodite', () => {
      const adapter = new AphroditeAesthetic();
      adapter.registerTheme('default', {});
      // @ts-ignore Allow access
      adapter.setStyleSheet('foo', () => SYNTAX_UNIFIED_LOCAL_FULL as any);

      const styleSheet = adapter.createStyleSheet('foo', {});

      expect(adapter.transformStyles([styleSheet.button], {})).toMatchSnapshot();
    });

    it('supports CSS modules', () => {
      const adapter = new CSSModulesAesthetic();
      adapter.registerTheme('default', {});
      // @ts-ignore Allow access
      adapter.setStyleSheet('foo', () => ({ button: 'button' }));

      const styleSheet = adapter.createStyleSheet('foo', {});

      expect(adapter.transformStyles([styleSheet.button], {})).toMatchSnapshot();
    });

    it('supports Fela', () => {
      const adapter = new FelaAesthetic(
        createRenderer({
          plugins: [...webPreset],
        }),
      );
      adapter.registerTheme('default', {});
      // @ts-ignore Allow access
      adapter.setStyleSheet('foo', () => SYNTAX_UNIFIED_LOCAL_FULL as any);

      const styleSheet = adapter.createStyleSheet('foo', {});

      expect(adapter.transformStyles([styleSheet.button], {})).toMatchSnapshot();
    });

    it('supports JSS', () => {
      const jss = create();
      jss.setup(preset());

      const adapter = new JSSAesthetic(jss);
      adapter.registerTheme('default', {});
      // @ts-ignore Allow access
      adapter.setStyleSheet('foo', () => SYNTAX_UNIFIED_LOCAL_FULL as any);

      const styleSheet = adapter.createStyleSheet('foo', {});

      expect(adapter.transformStyles([styleSheet.button], {})).toMatchSnapshot();
    });

    it('supports TypeStyle', () => {
      const adapter = new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: false }));
      adapter.registerTheme('default', {});
      // @ts-ignore Allow access
      adapter.setStyleSheet('foo', () => SYNTAX_UNIFIED_LOCAL_FULL as any);

      const styleSheet = adapter.createStyleSheet('foo', {});

      expect(adapter.transformStyles([styleSheet.button], {})).toMatchSnapshot();
    });
  });
});
