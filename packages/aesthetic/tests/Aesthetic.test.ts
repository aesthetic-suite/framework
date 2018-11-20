/* eslint-disable sort-keys */

import { StyleSheetTestUtils } from 'aphrodite';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { create } from 'jss';
import preset from 'jss-preset-default';
import Aesthetic from '../src/Aesthetic';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
import AphroditeAesthetic from '../../aesthetic-adapter-aphrodite/src';
import CSSModulesAesthetic from '../../aesthetic-adapter-css-modules/src';
import FelaAesthetic from '../../aesthetic-adapter-fela/src';
import JSSAesthetic from '../../aesthetic-adapter-jss/src';
import TypeStyleAesthetic from '../../aesthetic-adapter-typestyle/src';
import { SYNTAX_GLOBAL, SYNTAX_UNIFIED_LOCAL_FULL } from '../../../tests/mocks';

describe('Aesthetic', () => {
  let instance: Aesthetic<any, any, any>;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();

    instance = new ClassNameAesthetic();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  describe('constructor()', () => {
    it('merges options', () => {
      instance = new ClassNameAesthetic({
        stylesPropName: 'styleSheet',
      });

      expect(instance.options).toEqual({
        extendable: false,
        passThemeNameProp: true,
        passThemeProp: true,
        pure: false,
        stylesPropName: 'styleSheet',
        theme: 'default',
        themePropName: 'theme',
      });
    });
  });

  describe('createStyleSheet()', () => {
    it('returns the style sheet', () => {
      instance.themes.classic = {};
      instance.styles.foo = () => ({
        el: { display: 'block' },
      });

      // Will have no properties as no syntax handlers are defined
      expect(instance.createStyleSheet('foo', 'classic')).toEqual({
        el: {},
      });
    });
  });

  describe('extendTheme()', () => {
    it('errors if the parent theme doesnt exist', () => {
      expect(() => instance.extendTheme('foo', 'bar', {})).toThrowErrorMatchingSnapshot();
    });

    it('deep merges the parent and child theme', () => {
      instance.themes.foo = {
        unit: 'px',
        unitSize: 8,
        colors: {
          primary: 'red',
        },
      };

      instance.extendTheme('foo', 'bar', {
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
  });

  describe('getStyles()', () => {
    beforeEach(() => {
      instance.themes.classic = {};
    });

    it('errors if no theme', () => {
      instance.styles.foo = () => ({
        el: { display: 'block' },
      });

      expect(() => instance.getStyles('foo', 'unknown')).toThrowErrorMatchingSnapshot();
    });

    it('returns an empty object if null', () => {
      instance.styles.foo = null;

      expect(instance.getStyles('foo', 'classic')).toEqual({});
    });

    it('returns the stylesheet', () => {
      instance.styles.foo = () => ({
        el: { display: 'block' },
      });

      expect(instance.getStyles('foo', 'classic')).toEqual({
        el: { display: 'block' },
      });
    });

    it('passes theme to the style callback', () => {
      instance.themes.classic = {
        unitSize: 5,
      };

      instance.styles.foo = theme => ({
        el: { padding: theme.unitSize * 2 },
      });

      expect(instance.getStyles('foo', 'classic')).toEqual({
        el: { padding: 10 },
      });
    });

    it('passes props to the style callback', () => {
      instance.styles.foo = (theme, props) => ({
        el: { padding: props.unitSize * 2 },
      });

      expect(
        instance.getStyles('foo', 'classic', {
          unitSize: 5,
        }),
      ).toEqual({
        el: { padding: 10 },
      });
    });

    it('inherits styles from parent', () => {
      instance.setStyles('foo', () => ({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      }));

      instance.setStyles(
        'bar',
        () => ({
          el: {
            background: 'blue',
            ':hover': {
              color: 'green',
            },
          },
        }),
        'foo',
      );

      instance.setStyles(
        'baz',
        () => ({
          el: { display: 'block' },
        }),
        'bar',
      );

      expect(instance.getStyles('foo', 'classic')).toEqual({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      });

      expect(instance.getStyles('bar', 'classic')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          ':hover': {
            color: 'green',
          },
        },
      });

      expect(instance.getStyles('baz', 'classic')).toEqual({
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

  describe('getTheme()', () => {
    it('errors if the theme doesnt exist', () => {
      expect(() => instance.getTheme('foo')).toThrowErrorMatchingSnapshot();
    });

    it('returns the theme by name', () => {
      instance.registerTheme('foo', { unitSize: 6 });

      expect(instance.getTheme('foo')).toEqual({ unitSize: 6 });
    });

    it('returns the default theme if defined and requested them doesnt exist', () => {
      instance.registerTheme('default', { unitSize: 1 });
      instance.registerTheme('foo', { unitSize: 6 });
      instance.options.defaultTheme = 'default';

      expect(instance.getTheme('bar')).toEqual({ unitSize: 1 });
    });
  });

  describe('processStyleSheet()', () => {
    it('returns the styleSheet as a stylesheet', () => {
      const styleSheet = { el: {} };
      const stylesheet = instance.processStyleSheet(styleSheet, 'styleName');

      expect(styleSheet).toEqual(stylesheet);
    });
  });

  describe('registerTheme()', () => {
    it('errors if a theme name has been used', () => {
      instance.themes.foo = {};

      expect(() => instance.registerTheme('foo', {})).toThrowErrorMatchingSnapshot();
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

      expect(instance.themes).toEqual({
        foo: { unitSize: 6 },
      });

      expect(instance.globals.foo).toBeDefined();
    });
  });

  describe('setStyles()', () => {
    it('errors if styles have been set', () => {
      instance.styles.foo = () => ({});

      expect(() => instance.setStyles('foo', null)).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles try to extend from itself', () => {
      instance.styles.foo = () => ({});

      expect(() => instance.setStyles('foo', () => ({}), 'foo')).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles are not a function', () => {
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyles('foo', 123)).toThrowErrorMatchingSnapshot();
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyles('foo', 'abc')).toThrowErrorMatchingSnapshot();
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyles('foo', [])).toThrowErrorMatchingSnapshot();
      // @ts-ignore Allow invalid type
      expect(() => instance.setStyles('foo', true)).toThrowErrorMatchingSnapshot();
    });

    it('errors if extended styles do not exist', () => {
      expect(() => instance.setStyles('foo', null, 'parent')).toThrowErrorMatchingSnapshot();
    });

    it('errors if extended and style names match', () => {
      expect(() => instance.setStyles('foo', null, 'foo')).toThrowErrorMatchingSnapshot();
    });

    it('sets styles', () => {
      expect(instance.styles.foo).toBeUndefined();

      instance.setStyles('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      expect(instance.styles.foo).toBeDefined();
    });

    it('sets styles and extends parents', () => {
      expect(instance.styles.bar).toBeUndefined();
      expect(instance.parents.bar).toBeUndefined();

      instance.setStyles('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      instance.setStyles(
        'bar',
        () => ({
          child: { margin: 5 },
        }),
        'foo',
      );

      expect(instance.styles.bar!({}, {})).toEqual({
        child: { margin: 5 },
      });
      expect(instance.parents.bar).toBe('foo');
    });
  });

  describe('transformStyles()', () => {
    beforeEach(() => {
      instance = new AphroditeAesthetic();
    });

    it('errors for invalid value', () => {
      expect(() => {
        instance.transformStyles([[]]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('combines strings into a class name', () => {
      expect(instance.transformStyles('foo', 'bar')).toBe('foo bar');
    });

    it('calls transformToClassName() method', () => {
      const spy = jest.fn();

      instance.transformToClassName = spy;
      instance.transformStyles({ color: 'red' }, { display: 'block' });

      expect(spy).toHaveBeenCalledWith([{ color: 'red' }, { display: 'block' }]);
    });

    it('ignores falsey values', () => {
      expect(instance.transformStyles(null, false, 0, '', undefined)).toBe('');
    });

    it('strips period prefix', () => {
      expect(instance.transformStyles('.foo', 'bar .qux')).toBe('foo bar qux');
    });

    it('handles expression values', () => {
      expect(instance.transformStyles('foo', true && 'bar', 5 > 10 && 'baz')).toBe('foo bar');
    });

    it('joins strings and numbers', () => {
      expect(instance.transformStyles('foo', 123, 'bar')).toBe('foo 123 bar');
    });
  });

  describe('adapters', () => {
    it('supports class names', () => {
      instance = new ClassNameAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => ({ button: 'button' }));

      const styleSheet = instance.createStyleSheet('foo', 'default');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports Aphrodite', () => {
      instance = new AphroditeAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo', 'default');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports CSS modules', () => {
      instance = new CSSModulesAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => ({ button: 'button' }));

      const styleSheet = instance.createStyleSheet('foo', 'default');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports Fela', () => {
      instance = new FelaAesthetic(
        createRenderer({
          plugins: [...webPreset],
        }),
      );
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo', 'default');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports JSS', () => {
      const jss = create();
      jss.setup(preset());

      instance = new JSSAesthetic(jss);
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo', 'default');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports TypeStyle', () => {
      instance = new TypeStyleAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo', 'default');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });
  });
});
