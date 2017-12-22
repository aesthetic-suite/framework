/* eslint-disable sort-keys */

import { StyleSheetTestUtils } from 'aphrodite';
import Aesthetic from '../src/Aesthetic';
import ClassNameAdapter from '../src/ClassNameAdapter';
import AphroditeAdapter from '../../aesthetic-adapter-aphrodite/src/NativeAdapter';
import CssModulesAdapter from '../../aesthetic-adapter-css-modules/src/NativeAdapter';
import FelaAdapter from '../../aesthetic-adapter-fela/src/NativeAdapter';
import GlamorAdapter from '../../aesthetic-adapter-glamor/src/NativeAdapter';
import JssAdapter from '../../aesthetic-adapter-jss/src/NativeAdapter';
import TypeStyleAdapter from '../../aesthetic-adapter-typestyle/src/NativeAdapter';
import {
  TestAdapter,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_GLOBAL,
} from '../../../tests/mocks';

describe('aesthetic/Aesthetic', () => {
  let instance = null;

  beforeEach(() => {
    instance = new Aesthetic(new TestAdapter());
    StyleSheetTestUtils.suppressStyleInjection();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  describe('constructor()', () => {
    it('merges options', () => {
      instance = new Aesthetic(new TestAdapter(), {
        stylesPropName: 'styleSheet',
      });

      expect(instance.options).toEqual({
        defaultTheme: '',
        extendable: false,
        pure: false,
        stylesPropName: 'styleSheet',
        themePropName: 'theme',
      });
    });
  });

  describe('createStyleSheet()', () => {
    it('errors if no styles', () => {
      expect(() => instance.createStyleSheet('foo'))
        .toThrowError('Styles do not exist for "foo".');
    });

    it('errors if no theme', () => {
      instance.styles.foo = () => ({
        display: 'block',
      });

      expect(() => instance.createStyleSheet('foo', 'classic'))
        .toThrowError('Theme "classic" does not exist.');
    });

    it('calls adapters create() method', () => {
      const spy = jest.fn();

      instance.adapter.create = spy;
      instance.styles.foo = {
        display: 'block',
      };

      instance.createStyleSheet('foo');

      expect(spy).toHaveBeenCalledWith({
        display: 'block',
      });
    });

    it('returns the styleSheet', () => {
      instance.styles.foo = {
        display: 'block',
      };

      expect(instance.createStyleSheet('foo')).toEqual({
        display: 'block',
      });
    });

    it('returns the styleSheet from a callback', () => {
      instance.styles.foo = () => ({
        display: 'block',
      });

      expect(instance.createStyleSheet('foo')).toEqual({
        display: 'block',
      });
    });

    it('passes theme to the style callback', () => {
      instance.themes.classic = {
        unitSize: 5,
      };

      instance.styles.foo = theme => ({
        padding: theme.unitSize * 2,
      });

      expect(instance.createStyleSheet('foo', 'classic')).toEqual({
        padding: 10,
      });
    });

    it('passes props to the style callback', () => {
      instance.styles.foo = (theme, props) => ({
        padding: props.unitSize * 2,
      });

      expect(instance.createStyleSheet('foo', '', {
        unitSize: 5,
      })).toEqual({
        padding: 10,
      });
    });

    it('inherits styles from parent', () => {
      instance.setStyles('foo', () => ({
        color: 'red',
        ':hover': {
          color: 'darkred',
        },
      }));

      instance.setStyles('bar', () => ({
        background: 'blue',
        ':hover': {
          color: 'green',
        },
      }), 'foo');

      instance.setStyles('baz', () => ({
        display: 'block',
      }), 'bar');

      expect(instance.createStyleSheet('foo')).toEqual({
        color: 'red',
        ':hover': {
          color: 'darkred',
        },
      });

      expect(instance.createStyleSheet('bar')).toEqual({
        color: 'red',
        background: 'blue',
        ':hover': {
          color: 'green',
        },
      });

      expect(instance.createStyleSheet('baz')).toEqual({
        color: 'red',
        background: 'blue',
        display: 'block',
        ':hover': {
          color: 'green',
        },
      });
    });
  });

  describe('extendTheme()', () => {
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

  describe('getTheme()', () => {
    it('errors if the theme doesnt exist', () => {
      expect(() => instance.getTheme('foo'))
        .toThrowError('Theme "foo" does not exist.');
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

    it('registers theme and creates global stylesheet', () => {
      const spy = jest.fn();

      instance.adapter.create = spy;
      instance.registerTheme('foo', { unitSize: 6 }, SYNTAX_GLOBAL);

      expect(instance.themes).toEqual({
        foo: { unitSize: 6 },
      });

      expect(spy).toHaveBeenCalledWith(SYNTAX_GLOBAL);
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
    it('combines strings into a class name', () => {
      expect(instance.transformStyles(['foo', 'bar'])).toBe('foo bar');
    });

    it('combines and transforms objects into a class name', () => {
      expect(instance.transformStyles([{ color: 'red' }])).toBe('header');

      expect(instance.transformStyles([
        { color: 'red' },
        { display: 'block' },
      ])).toBe('header_footer');
    });

    it('calls adapters transform() method', () => {
      const spy = jest.fn();

      instance.adapter.transform = spy;

      instance.transformStyles([
        { color: 'red' },
        { display: 'block' },
      ]);

      expect(spy).toHaveBeenCalledWith(
        { color: 'red' },
        { display: 'block' },
      );
    });

    it('ignores falsey values', () => {
      expect(instance.transformStyles([
        null,
        false,
        0,
        '',
        undefined,
      ])).toBe('');
    });

    it('strips period prefix', () => {
      expect(instance.transformStyles([
        '.foo',
        'bar .qux',
      ])).toBe('foo bar qux');
    });

    it('handles expression values', () => {
      expect(instance.transformStyles([
        'foo',
        true && 'bar',
        (5 > 10) && 'baz',
      ])).toBe('foo bar');
    });

    it('joins strings and numbers', () => {
      expect(instance.transformStyles([
        'foo',
        123,
        'bar',
      ])).toBe('foo 123 bar');
    });
  });

  describe('adapters', () => {
    let styleSheet;

    beforeEach(() => {
      instance.setStyles('foo', SYNTAX_NATIVE_PARTIAL);
    });

    it('supports standard class names', () => {
      instance.setAdapter(new ClassNameAdapter());
      styleSheet = instance.createStyleSheet('foo');

      // Only strings are supported
      expect(instance.transformStyles(['button'])).toBe('button');
    });

    it('supports Aphrodite', () => {
      instance.setAdapter(new AphroditeAdapter());
      styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles([styleSheet.button])).toBe('button_13l44zh');
    });

    it('supports CSS modules', () => {
      instance.setAdapter(new CssModulesAdapter());
      styleSheet = instance.createStyleSheet('foo');

      // Styles are passed as strings, so fake it
      expect(instance.transformStyles(['cssm-button'])).toBe('cssm-button');
    });

    it('supports Fela', () => {
      instance.setAdapter(new FelaAdapter());
      styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles([styleSheet.button]))
        .toBe('a b c d e f g h i j k l m n o p q r s t u v w');
    });

    it('supports Glamor', () => {
      instance.setAdapter(new GlamorAdapter());
      styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles([styleSheet.button])).toBe('css-1n8n9n3');
    });

    it('supports JSS', () => {
      instance.setAdapter(new JssAdapter());
      styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles([styleSheet.button])).toBe('button-0-1');
    });

    it('supports TypeStyle', () => {
      instance.setAdapter(new TypeStyleAdapter());
      styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles([styleSheet.button])).toBe('f7tlree');
    });
  });
});
