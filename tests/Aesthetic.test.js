import Aesthetic from '../src/Aesthetic';
import { TestAdapter, TEST_CLASS_NAMES, FONT_ROBOTO } from './mocks';

describe('Aesthetic', () => {
  let instance = null;

  beforeEach(() => {
    instance = new Aesthetic(new TestAdapter());
  });

  describe('extendTheme', () => {
    it('errors if the parent theme doesnt exist', () => {
      expect(() => instance.extendTheme('foo', 'bar', {}))
        .toThrowError('Theme "foo" does not exist.');
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
    it('errors if no styles', () => {
      expect(() => instance.getStyles('foo'))
        .toThrowError('Styles do not exist for "foo".');
    });

    it('errors if no theme', () => {
      instance.styles.foo = () => ({
        display: 'block',
      });

      expect(() => instance.getStyles('foo', 'classic'))
        .toThrowError('Theme "classic" does not exist.');
    });

    it('returns the object as is', () => {
      instance.styles.foo = {
        display: 'block',
      };

      expect(instance.getStyles('foo')).toEqual({
        display: 'block',
      });
    });

    it('passes the theme to the style callback', () => {
      instance.themes.classic = {
        unitSize: 5,
      };

      instance.styles.foo = (theme: Object) => ({
        padding: theme.unitSize * 2,
      });

      expect(instance.getStyles('foo', 'classic')).toEqual({
        padding: 10,
      });
    });

    it('inherits styles from parent', () => {
      instance.setStyles('foo', (theme: Object, prevStyles: Object) => ({
        ...prevStyles,
        color: 'red',
      }));

      instance.setStyles('bar', (theme: Object, prevStyles: Object) => ({
        ...prevStyles,
        background: 'blue',
      }), 'foo');

      instance.setStyles('baz', (theme: Object, prevStyles: Object) => ({
        ...prevStyles,
        display: 'block',
      }), 'bar');

      expect(instance.getStyles('foo')).toEqual({
        color: 'red',
      });

      expect(instance.getStyles('bar')).toEqual({
        color: 'red',
        background: 'blue',
      });

      expect(instance.getStyles('baz')).toEqual({
        color: 'red',
        background: 'blue',
        display: 'block',
      });
    });
  });

  describe('registerTheme()', () => {
    it('errors if a theme name has been used', () => {
      instance.themes.foo = {};

      expect(() => instance.registerTheme('foo'))
        .toThrowError('Theme "foo" already exists.');
    });

    it('errors if a theme style is not an object', () => {
      expect(() => instance.registerTheme('foo', 123))
        .toThrowError('Theme "foo" must be a style object.');
    });

    it('errors if global styles is not an object', () => {
      expect(() => instance.registerTheme('foo', {}, 123))
        .toThrowError('Global styles for "foo" must be an object.');
    });

    it('registers theme and transforms global styles', () => {
      instance.registerTheme('foo', { unitSize: 6 }, {
        '@font-face': {
          roboto: FONT_ROBOTO,
        },
      });

      expect(instance.themes).toEqual({
        foo: { unitSize: 6 },
      });
      expect(instance.adapter.lastTransform).toEqual({
        '@font-face': {
          roboto: FONT_ROBOTO,
        },
      });
    });
  });

  describe('setAdapter()', () => {
    it('errors if not an instance of `Adapter`', () => {
      const error = 'Adapter must be an instance of `Adapter`.';

      expect(() => instance.setAdapter(true)).toThrowError(error);
      expect(() => instance.setAdapter(123)).toThrowError(error);
      expect(() => instance.setAdapter('foo')).toThrowError(error);
      expect(() => instance.setAdapter({})).toThrowError(error);
      expect(() => instance.setAdapter([])).toThrowError(error);
    });

    it('sets an adapter', () => {
      const adapter = new TestAdapter();

      expect(instance.adapter).not.toBe(adapter);

      instance.setAdapter(adapter);

      expect(instance.adapter).toBe(adapter);
    });
  });

  describe('setStyles()', () => {
    it('errors if styles have been set', () => {
      instance.styles.foo = {};

      expect(() => instance.setStyles('foo', {}))
        .toThrowError('Styles have already been set for "foo".');
    });

    it('errors if styles are empty', () => {
      expect(() => instance.setStyles('foo'))
        .toThrowError('Styles defined for "foo" must be an object or function.');
    });

    it('errors if styles are not an object', () => {
      const error = 'Styles defined for "foo" must be an object or function.';

      expect(() => instance.setStyles('foo', 123)).toThrowError(error);
      expect(() => instance.setStyles('foo', 'abc')).toThrowError(error);
      expect(() => instance.setStyles('foo', [])).toThrowError(error);
      expect(() => instance.setStyles('foo', true)).toThrowError(error);
    });

    it('errors if extended styles do not exist', () => {
      expect(() => instance.setStyles('foo', {}, 'parent'))
        .toThrowError('Cannot extend from "parent" as those styles do not exist.');
    });

    it('errors if extended and style names match', () => {
      expect(() => instance.setStyles('foo', {}, 'foo'))
        .toThrowError('Cannot extend styles from itself.');
    });

    it('sets styles', () => {
      expect(instance.styles.foo).toBeUndefined();

      instance.setStyles('foo', {
        header: { color: 'red' },
        footer: { padding: 5 },
      });

      expect(instance.styles.foo).toEqual({
        header: { color: 'red' },
        footer: { padding: 5 },
      });
    });

    it('sets styles and extends parents', () => {
      expect(instance.styles.bar).toBeUndefined();
      expect(instance.parents.bar).toBeUndefined();

      instance.setStyles('foo', {
        header: { color: 'red' },
        footer: { padding: 5 },
      });

      instance.setStyles('bar', {
        child: { margin: 5 },
      }, 'foo');

      expect(instance.styles.bar).toEqual({
        child: { margin: 5 },
      });
      expect(instance.parents.bar).toBe('foo');
    });
  });

  describe('transformStyles()', () => {
    it('errors if no styles have been defined', () => {
      expect(() => instance.transformStyles('foo')).toThrowError('Styles do not exist for "foo".');
    });

    it('returns the cached and transformed class names', () => {
      instance.classNames['foo:'] = { ...TEST_CLASS_NAMES };

      expect(instance.transformStyles('foo')).toEqual(TEST_CLASS_NAMES);
    });

    it('returns an object of strings as is', () => {
      expect(instance.classNames['foo:']).toBeUndefined();

      instance.styles.foo = { ...TEST_CLASS_NAMES };

      expect(instance.transformStyles('foo')).toEqual(TEST_CLASS_NAMES);
      expect(instance.classNames['foo:']).toEqual(TEST_CLASS_NAMES);
    });

    it('errors if the adapter does not return a string', () => {
      instance.setAdapter(new TestAdapter());
      instance.setStyles('foo', {
        header: { color: 'red' },
      });

      expect(() => instance.transformStyles('foo'))
        .toThrowError('`TestAdapter` must return a mapping of CSS class names. "foo@header" is not a valid string.');
    });

    it('sets and caches styles', () => {
      expect(instance.classNames['bar:']).toBeUndefined();

      instance.setAdapter(new TestAdapter());
      instance.setStyles('bar', {
        header: { color: 'red' },
        footer: { color: 'blue' },
      });
      instance.transformStyles('bar');

      expect(instance.classNames['bar:']).toEqual(TEST_CLASS_NAMES);
    });
  });
});
