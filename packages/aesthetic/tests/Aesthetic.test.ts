/* eslint-disable sort-keys */

import { StyleSheetTestUtils } from 'aphrodite';
import Aesthetic from '../src/Aesthetic';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
// import AphroditeAdapter from '../../aesthetic-adapter-aphrodite/src/NativeAdapter';
// import CssModulesAdapter from '../../aesthetic-adapter-css-modules/src/NativeAdapter';
// import FelaAdapter from '../../aesthetic-adapter-fela/src/NativeAdapter';
import GlamorAdapter from '../../aesthetic-adapter-glamor/src/NativeAdapter';
import JssAdapter from '../../aesthetic-adapter-jss/src/NativeAdapter';
import TypeStyleAdapter from '../../aesthetic-adapter-typestyle/src/NativeAdapter';
import { SYNTAX_NATIVE_PARTIAL, SYNTAX_GLOBAL } from '../../../tests/mocks';

describe('Aesthetic', () => {
  let instance: Aesthetic<any, any>;

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
        defaultTheme: '',
        extendable: false,
        passThemeNameProp: true,
        passThemeProp: true,
        pure: false,
        stylesPropName: 'styleSheet',
        themePropName: 'theme',
      });
    });
  });

  describe('convertStyleSheet()', () => {
    it('returns the styleSheet as a stylesheet', () => {
      const styleSheet = { el: {} };
      const stylesheet = instance.convertStyleSheet(styleSheet, 'styleName');

      expect(styleSheet).toEqual(stylesheet);
    });
  });

  describe('createStyleSheet()', () => {
    it('returns the style sheet', () => {
      instance.themes.classic = {};
      instance.styles.foo = () => ({
        el: { display: 'block' },
      });

      expect(instance.createStyleSheet('foo', 'classic')).toEqual({
        el: { display: 'block' },
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
      expect(instance.styles['foo:root']).toBeUndefined();

      instance.registerTheme('foo', { unitSize: 6 }, () => SYNTAX_GLOBAL);

      expect(instance.themes).toEqual({
        foo: { unitSize: 6 },
      });

      expect(instance.styles['foo:root']).toBeDefined();
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
    it('errors for invalid value', () => {
      expect(() => {
        instance.transformStyles([[]]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('combines strings into a class name', () => {
      expect(instance.transformStyles(['foo', 'bar'])).toBe('foo bar');
    });

    it('combines and transforms objects into a class name', () => {
      expect(instance.transformStyles([{ color: 'red' }])).toBe('foo_1');

      expect(instance.transformStyles([{ color: 'red' }, { display: 'block' }])).toBe(
        'foo_2-bar_3',
      );
    });

    it('calls transformToClassName() method', () => {
      const spy = jest.fn();

      instance.transformToClassName = spy;
      instance.transformStyles([{ color: 'red' }, { display: 'block' }]);

      expect(spy).toHaveBeenCalledWith({ color: 'red' }, { display: 'block' });
    });

    it('ignores falsey values', () => {
      expect(instance.transformStyles([null, false, 0, '', undefined])).toBe('');
    });

    it('strips period prefix', () => {
      expect(instance.transformStyles(['.foo', 'bar .qux'])).toBe('foo bar qux');
    });

    it('handles expression values', () => {
      expect(instance.transformStyles(['foo', true && 'bar', 5 > 10 && 'baz'])).toBe('foo bar');
    });

    it('joins strings and numbers', () => {
      expect(instance.transformStyles(['foo', 123, 'bar'])).toBe('foo 123 bar');
    });

    it('caches transformation', () => {
      const a = [{ color: 'red' }];

      expect(instance.transformStyles(a)).toBe('foo_1');
      expect(instance.cache.get(a)).toBe('foo_1');

      const b = [{ display: 'block' }];

      expect(instance.transformStyles(b)).toBe('foo_2');
      expect(instance.cache.get(b)).toBe('foo_2');

      const c = [{ color: 'red' }, { display: 'block' }];

      expect(instance.transformStyles(c)).toBe('foo_3-bar_4');
      expect(instance.cache.get(c)).toBe('foo_3-bar_4');
    });
  });

  // describe.skip('adapters', () => {
  //   let styleSheet;

  //   beforeEach(() => {
  //     instance.setStyles('foo', SYNTAX_NATIVE_PARTIAL);
  //   });

  //   it('supports standard class names', () => {
  //     instance.setAdapter(new ClassNameAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     // Only strings are supported
  //     expect(instance.transformStyles(['button'])).toBe('button');
  //   });

  //   it('supports Aphrodite', () => {
  //     instance.setAdapter(new AphroditeAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     expect(instance.transformStyles([styleSheet.button])).toBe('button_13l44zh');
  //   });

  //   it('supports CSS modules', () => {
  //     instance.setAdapter(new CssModulesAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     // Styles are passed as strings, so fake it
  //     expect(instance.transformStyles(['cssm-button'])).toBe('cssm-button');
  //   });

  //   it('supports Fela', () => {
  //     instance.setAdapter(new FelaAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     expect(instance.transformStyles([styleSheet.button])).toBe(
  //       'a b c d e f g h i j k l m n o p q r s t u v w',
  //     );
  //   });

  //   it('supports Glamor', () => {
  //     instance.setAdapter(new GlamorAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     expect(instance.transformStyles([styleSheet.button])).toBe('css-1n8n9n3');
  //   });

  //   it('supports JSS', () => {
  //     instance.setAdapter(new JssAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     expect(instance.transformStyles([styleSheet.button])).toBe('foo-button-0-1-1');
  //   });

  //   it('supports TypeStyle', () => {
  //     instance.setAdapter(new TypeStyleAdapter());
  //     styleSheet = instance.createStyleSheet('foo');

  //     expect(instance.transformStyles([styleSheet.button])).toBe('f7tlree');
  //   });
  // });
});
