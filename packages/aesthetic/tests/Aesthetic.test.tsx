/* eslint-disable sort-keys */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { create } from 'jss';
import preset from 'jss-preset-default';
import Aesthetic from '../src/Aesthetic';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
import { Block } from '../src/types';
import AphroditeAesthetic from '../../aesthetic-adapter-aphrodite/src';
import CSSModulesAesthetic from '../../aesthetic-adapter-css-modules/src';
import FelaAesthetic from '../../aesthetic-adapter-fela/src';
import JSSAesthetic from '../../aesthetic-adapter-jss/src';
import TypeStyleAesthetic from '../../aesthetic-adapter-typestyle/src';
import { SYNTAX_GLOBAL, SYNTAX_UNIFIED_LOCAL_FULL } from '../../../tests/mocks';

describe('Aesthetic', () => {
  let instance: Aesthetic<any, any, any>;

  class TestAesthetic extends Aesthetic<any, Block, Block> {
    transformToClassName(styles: any[]): string {
      return styles.map((style, i) => `class-${i}`).join(' ');
    }
  }

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();

    instance = new TestAesthetic();
    instance.registerTheme('default', { unit: 8 }, ({ unit }) => ({
      '@global': {
        body: {
          padding: unit,
        },
      },
    }));
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

  describe('applyGlobalStyles()', () => {
    it('does nothing if already applied', () => {
      const spy = jest.spyOn(instance, 'flushStyles');

      // @ts-ignore Allow override
      instance.appliedGlobals = true;
      instance.applyGlobalStyles();

      expect(spy).not.toHaveBeenCalled();
    });

    it('does nothing if no global styles defined for theme', () => {
      const spy = jest.spyOn(instance, 'processStyleSheet');

      instance.globals.default = null;
      instance.applyGlobalStyles();

      expect(spy).not.toHaveBeenCalled();
    });

    it('processes global styles if defined for a theme', () => {
      const spy = jest.spyOn(instance, 'processStyleSheet');

      instance.applyGlobalStyles();

      expect(spy).toHaveBeenCalledWith({}, ':root');
    });
  });

  // Will have no properties as no unified syntax handlers are defined
  describe('createStyleSheet()', () => {
    beforeEach(() => {
      instance.setStyles('foo', ({ unit }, { color = 'black' }) => ({
        el: {
          display: 'block',
          padding: unit,
          color,
        },
      }));
    });

    it('returns the style sheet', () => {
      expect(instance.createStyleSheet('foo')).toEqual({
        el: {},
      });
    });

    it('calls `convertStyleSheet` for unified syntax, while passing theme and props', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.createStyleSheet('foo', { color: 'red' });

      expect(spy).toHaveBeenCalledWith({
        el: {
          display: 'block',
          padding: 8,
          color: 'red',
        },
      });
    });

    it('calls `processStyleSheet` with converted syntax', () => {
      const spy = jest.spyOn(instance, 'processStyleSheet');

      instance.createStyleSheet('foo');

      expect(spy).toHaveBeenCalledWith({ el: {} }, 'foo');
    });

    it('calls `applyGlobalStyles`', () => {
      const spy = jest.spyOn(instance, 'applyGlobalStyles');

      instance.createStyleSheet('foo');

      expect(spy).toHaveBeenCalled();
    });

    it('caches the result', () => {
      expect(instance.cache.foo).toBeUndefined();

      instance.createStyleSheet('foo');

      expect(instance.cache.foo).toEqual({ el: {} });

      const sheet = instance.createStyleSheet('foo');

      expect(instance.cache.foo).toEqual(sheet);
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
  });

  describe('getStyles()', () => {
    beforeEach(() => {
      instance.setStyles('foo', () => ({
        el: { display: 'block' },
      }));
    });

    it('errors if no theme', () => {
      instance.options.theme = 'unknown';

      expect(() => instance.getStyles('foo')).toThrowErrorMatchingSnapshot();
    });

    it('returns an empty object if styles are null', () => {
      instance.styles.foo = null;

      expect(instance.getStyles('foo')).toEqual({});
    });

    it('returns the stylesheet', () => {
      expect(instance.getStyles('foo')).toEqual({
        el: { display: 'block' },
      });
    });

    it('passes theme to the style callback', () => {
      instance.setStyles('bar', theme => ({
        el: { padding: theme.unit * 2 },
      }));

      expect(instance.getStyles('bar')).toEqual({
        el: { padding: 16 },
      });
    });

    it('passes props to the style callback', () => {
      instance.setStyles('baz', (theme, props) => ({
        el: { padding: props.unit * 2 },
      }));

      expect(
        instance.getStyles('baz', {
          unit: 5,
        }),
      ).toEqual({
        el: { padding: 10 },
      });
    });

    it('inherits styles from parent', () => {
      instance.setStyles('bar', () => ({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      }));

      instance.setStyles(
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

      instance.setStyles(
        'qux',
        () => ({
          el: { display: 'block' },
        }),
        'baz',
      );

      expect(instance.getStyles('bar')).toEqual({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      });

      expect(instance.getStyles('baz')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          ':hover': {
            color: 'green',
          },
        },
      });

      expect(instance.getStyles('qux')).toEqual({
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

    it('errors if the theme is not an object', () => {
      instance.themes.default = 123;

      expect(() => instance.getTheme()).toThrowErrorMatchingSnapshot();
    });

    it('returns the default theme if no name provided', () => {
      expect(instance.getTheme()).toEqual({ unit: 8 });
    });

    it('returns the theme by name', () => {
      expect(instance.getTheme('default')).toEqual({ unit: 8 });
    });
  });

  describe('processStyleSheet()', () => {
    it('returns the style sheet as an object', () => {
      const sheet = { el: {} };
      const stylesheet = instance.processStyleSheet(sheet, 'styleName');

      expect(sheet).toEqual(stylesheet);
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

  describe('setStyles()', () => {
    it('errors if styles have been set', () => {
      instance.styles.foo = () => ({});

      expect(() => instance.setStyles('foo', null)).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles try to extend from itself', () => {
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

      expect(instance.parents.bar).toBe('foo');
    });
  });

  describe('transformStyles()', () => {
    it('errors for invalid value', () => {
      expect(() => {
        instance.transformStyles([true]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('combines strings into a class name', () => {
      expect(instance.transformStyles('foo', 'bar')).toBe('foo bar');
    });

    it('calls `transformToClassName` method', () => {
      const spy = jest.spyOn(instance, 'transformToClassName');

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

  describe('withStyles()', () => {
    function BaseComponent() {
      return null;
    }

    function StylesComponent(props: { [key: string]: any }) {
      return <div />;
    }

    const TEST_STATEMENT = {
      footer: { color: 'blue' },
      header: { color: 'red' },
    };

    it('returns an HOC factory', () => {
      const hoc = instance.withStyles(() => ({}));

      expect(hoc).toBeInstanceOf(Function);
    });

    it('extends `React.Component` by default', () => {
      const Wrapped = instance.withStyles(null)(BaseComponent);

      expect(Object.getPrototypeOf(Wrapped)).toBe(React.Component);
    });

    it('extends `React.PureComponent` when `pure` is true', () => {
      const Wrapped = instance.withStyles(null, { pure: true })(BaseComponent);

      expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
    });

    it('extends `React.PureComponent` when Aesthetic option `pure` is true', () => {
      instance.options.pure = true;

      const Wrapped = instance.withStyles(null)(BaseComponent);

      expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
    });

    it('doesnt extend `React.PureComponent` when Aesthetic option `pure` is true but local is false', () => {
      instance.options.pure = true;

      const Wrapped = instance.withStyles(null, { pure: false })(BaseComponent);

      expect(Object.getPrototypeOf(Wrapped)).not.toBe(React.PureComponent);
    });

    it('inherits name from component `constructor.name`', () => {
      const Wrapped = instance.withStyles(null)(BaseComponent);

      expect(Wrapped.displayName).toBe('withAesthetic(BaseComponent)');
      expect(Wrapped.styleName).toEqual(expect.stringMatching(/^BaseComponent/i));
    });

    it('inherits name from component `displayName`', () => {
      class DisplayComponent extends React.Component<any> {
        static displayName = 'CustomDisplayName';

        render() {
          return null;
        }
      }

      const Wrapped = instance.withStyles(null)(DisplayComponent);

      expect(Wrapped.displayName).toBe('withAesthetic(CustomDisplayName)');
      expect(Wrapped.styleName).toEqual(expect.stringMatching(/^CustomDisplayName/i));
    });

    it('stores the original component as a static property', () => {
      const Wrapped = instance.withStyles(null)(BaseComponent);

      expect(Wrapped.WrappedComponent).toBe(BaseComponent);
    });

    it('defines static method for extending styles', () => {
      const Wrapped = instance.withStyles(null)(BaseComponent);

      expect(Wrapped.extendStyles).toBeInstanceOf(Function);
    });

    it('sets styles on the `Aesthetic` instance', () => {
      const styles = () => ({
        button: {
          display: 'inline-block',
          padding: 5,
        },
      });
      const Wrapped = instance.withStyles(styles)(BaseComponent);

      expect(instance.styles[Wrapped.styleName]).toBe(styles);
    });

    it('can set styles using `extendStyles`', () => {
      const Wrapped = instance.withStyles(
        () => ({
          button: {
            display: 'inline-block',
            padding: 5,
          },
        }),
        {
          extendable: true,
        },
      )(BaseComponent);

      expect(instance.getStyles(Wrapped.styleName)).toEqual({
        button: {
          display: 'inline-block',
          padding: 5,
        },
      });

      const Extended = Wrapped.extendStyles(() => ({
        notButton: {
          color: 'red',
        },
      }));

      expect(instance.getStyles(Extended.styleName)).toEqual({
        button: {
          display: 'inline-block',
          padding: 5,
        },
        notButton: {
          color: 'red',
        },
      });
    });

    it('can set extended components as non-extendable', () => {
      const Wrapped = instance.withStyles(() => ({}), {
        extendable: true,
      })(BaseComponent);

      const Extended = Wrapped.extendStyles(() => ({}), {
        extendable: false,
      });

      expect(() => {
        Extended.extendStyles(() => ({}));
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if extending styles that dont exist', () => {
      const Wrapped = instance.withStyles(null, {
        extendable: true,
      })(BaseComponent);

      expect(() => {
        Wrapped.extendStyles(null);
      }).toThrowError();
    });

    it('inherits theme from Aesthetic options', () => {
      function ThemeComponent() {
        return <div />;
      }

      const Wrapped = instance.withStyles(null, { passThemeProp: true, passThemeNameProp: true })(
        ThemeComponent,
      );
      const wrapper = shallow(<Wrapped />);

      expect(wrapper.prop('themeName')).toBe('default');
      expect(wrapper.prop('theme')).toEqual({ unit: 8 });
    });

    it('transforms styles on mount', () => {
      const spy = jest.spyOn(instance, 'createStyleSheet');
      const Wrapped = instance.withStyles(() => TEST_STATEMENT)(StylesComponent);
      const wrapper = shallow(<Wrapped foo="abc" />);

      expect(spy).toHaveBeenCalledWith(Wrapped.styleName, { foo: 'abc', wrappedRef: null });
      expect(wrapper.state('styles')).toEqual({
        header: {},
        footer: {},
      });
    });

    it('transforms styles when props change', () => {
      const spy = jest.spyOn(instance, 'createStyleSheet');
      const Wrapped = instance.withStyles(() => TEST_STATEMENT)(StylesComponent);
      const wrapper = shallow(<Wrapped foo="abc" />);

      expect(spy).toHaveBeenCalledWith(Wrapped.styleName, { foo: 'abc', wrappedRef: null });

      wrapper.setProps({
        foo: 'xyz',
      });

      expect(spy).toHaveBeenCalledWith(Wrapped.styleName, { foo: 'xyz', wrappedRef: null });
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('doesnt transform styles if props are the same', () => {
      const spy = jest.spyOn(instance, 'createStyleSheet');
      const Wrapped = instance.withStyles(() => TEST_STATEMENT)(StylesComponent);
      const wrapper = shallow(<Wrapped foo="abc" />);

      expect(spy).toHaveBeenCalled();

      wrapper.setProps({
        foo: 'abc',
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('can customize props with the withStyles options', () => {
      const Wrapped = instance.withStyles(() => TEST_STATEMENT, {
        stylesPropName: 'styleSheet',
        themePropName: 'someThemeNameHere',
      })(StylesComponent);
      const wrapper = shallow(<Wrapped />);

      expect(wrapper.prop('styleSheet')).toBeDefined();
      expect(wrapper.prop('someThemeNameHere')).toBeDefined();
    });

    it('can customize props with the options through the `Aesthetic` instance', () => {
      instance.options.stylesPropName = 'styleSheet';
      instance.options.themePropName = 'someThemeNameHere';

      const Wrapped = instance.withStyles(() => TEST_STATEMENT)(StylesComponent);
      const wrapper = shallow(<Wrapped />);

      expect(wrapper.prop('styleSheet')).toBeDefined();
      expect(wrapper.prop('someThemeNameHere')).toBeDefined();
    });

    it('doesnt pass theme prop if `options.passThemeProp` is false', () => {
      const Wrapped = instance.withStyles(() => TEST_STATEMENT, { passThemeProp: false })(
        StylesComponent,
      );
      const wrapper = shallow(<Wrapped />);

      expect(wrapper.prop('theme')).toBeUndefined();
    });

    it('doesnt pass themeName prop if `options.passThemeNameProp` is false', () => {
      const Wrapped = instance.withStyles(() => TEST_STATEMENT, { passThemeNameProp: false })(
        StylesComponent,
      );
      const wrapper = shallow(<Wrapped />);

      expect(wrapper.prop('themeName')).toBeUndefined();
    });

    it('doesnt pass both props', () => {
      const Wrapped = instance.withStyles(() => TEST_STATEMENT, {
        passThemeNameProp: false,
        passThemeProp: false,
      })(StylesComponent);
      const wrapper = shallow(<Wrapped />);

      expect(wrapper.prop('themeName')).toBeUndefined();
      expect(wrapper.prop('theme')).toBeUndefined();
    });

    it('can bubble up the ref with `wrappedRef`', () => {
      class RefComponent extends React.Component<any> {
        render() {
          return <div />;
        }
      }

      let refInstance = null;
      const Wrapped = instance.withStyles(null)(RefComponent);

      mount(
        <Wrapped
          themeName="classic"
          wrappedRef={ref => {
            refInstance = ref;
          }}
        />,
      );

      expect(refInstance).not.toBeNull();
      expect(refInstance.constructor.name).toBe('RefComponent');
    });

    it('passes props to style function', () => {
      const spy = jest.spyOn(instance, 'createStyleSheet');
      const Wrapped = instance.withStyles(null)(StylesComponent);

      shallow(<Wrapped foo={123} bar="abc" baz />);

      expect(spy).toHaveBeenCalledWith(Wrapped.styleName, {
        bar: 'abc',
        baz: true,
        foo: 123,
        wrappedRef: null,
      });
    });

    it('passes function component default props to style function', () => {
      function FuncComp(props: { [key: string]: any }) {
        return <div />;
      }

      FuncComp.defaultProps = {
        bar: 'abc',
        baz: true,
        foo: 123,
      };

      const spy = jest.spyOn(instance, 'createStyleSheet');
      const Wrapped = instance.withStyles(null)(FuncComp);

      shallow(<Wrapped />);

      expect(spy).toHaveBeenCalledWith(Wrapped.styleName, {
        bar: 'abc',
        baz: true,
        foo: 123,
        wrappedRef: null,
      });
    });

    it('passes class component default props to style function', () => {
      class ClassComp extends React.Component<any> {
        static defaultProps = {
          bar: 'abc',
          baz: true,
          foo: 123,
        };

        render() {
          return <div />;
        }
      }

      const spy = jest.spyOn(instance, 'createStyleSheet');
      const Wrapped = instance.withStyles(null)(ClassComp);

      shallow(<Wrapped />);

      expect(spy).toHaveBeenCalledWith(Wrapped.styleName, {
        bar: 'abc',
        baz: true,
        foo: 123,
        wrappedRef: null,
      });
    });
  });

  describe('adapters', () => {
    it('supports class names', () => {
      instance = new ClassNameAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => ({ button: 'button' }));

      const styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports Aphrodite', () => {
      instance = new AphroditeAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports CSS modules', () => {
      instance = new CSSModulesAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => ({ button: 'button' }));

      const styleSheet = instance.createStyleSheet('foo');

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

      const styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports JSS', () => {
      const jss = create();
      jss.setup(preset());

      instance = new JSSAesthetic(jss);
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });

    it('supports TypeStyle', () => {
      instance = new TypeStyleAesthetic();
      instance.registerTheme('default', {});
      instance.setStyles('foo', () => SYNTAX_UNIFIED_LOCAL_FULL);

      const styleSheet = instance.createStyleSheet('foo');

      expect(instance.transformStyles(styleSheet.button)).toMatchSnapshot();
    });
  });
});
