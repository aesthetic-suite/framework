import React from 'react';
import { shallow, mount } from 'enzyme';
import Aesthetic from '../src/Aesthetic';
import style from '../src/style';
import { TestAdapter } from '../../../tests/mocks';

function BaseComponent() {
  return null;
}

const TEST_STATEMENT = {
  footer: { color: 'blue' },
  header: { color: 'red' },
};

describe('aesthetic/style()', () => {
  let aesthetic;

  beforeEach(() => {
    aesthetic = new Aesthetic(new TestAdapter());
    aesthetic.registerTheme('default', { color: 'red' });
    aesthetic.registerTheme('classic', { color: 'blue' });
  });

  it('extends `React.Component` by default', () => {
    const Wrapped = style(aesthetic)(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.Component);
  });

  it('extends `React.PureComponent` when `pure` is true', () => {
    const Wrapped = style(aesthetic, {}, { pure: true })(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
  });

  it('extends `React.PureComponent` when Aesthetic option `pure` is true', () => {
    aesthetic.options.pure = true;

    const Wrapped = style(aesthetic)(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
  });

  it('doesnt extend `React.PureComponent` when Aesthetic option `pure` is true but local is false', () => {
    aesthetic.options.pure = true;

    const Wrapped = style(aesthetic, {}, { pure: false })(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).not.toBe(React.PureComponent);
  });

  it('inherits name from component `constructor.name`', () => {
    const Wrapped = style(aesthetic)(BaseComponent);

    expect(Wrapped.displayName).toBe('Aesthetic(BaseComponent)');
    expect(Wrapped.styleName).toBe('BaseComponent');
  });

  it('inherits name from component `displayName`', () => {
    // eslint-disable-next-line
    class DisplayComponent extends React.Component {
      static displayName = 'CustomDisplayName';

      render() {
        return null;
      }
    }

    const Wrapped = style(aesthetic)(DisplayComponent);

    expect(Wrapped.displayName).toBe('Aesthetic(CustomDisplayName)');
    expect(Wrapped.styleName).toBe('CustomDisplayName');
  });

  it('inherits style name from `options.styleName`', () => {
    const Wrapped = style(aesthetic, {}, {
      styleName: 'CustomStyleName',
    })(BaseComponent);

    expect(Wrapped.displayName).toBe('Aesthetic(CustomStyleName)');
    expect(Wrapped.styleName).toBe('CustomStyleName');
  });

  it('stores the original component as a static property', () => {
    const Wrapped = style(aesthetic)(BaseComponent);

    expect(Wrapped.WrappedComponent).toBe(BaseComponent);
  });

  it('sets default styles on the `Aesthetic` instance', () => {
    expect(aesthetic.styles.BaseComponent).toBeUndefined();

    style(aesthetic, {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })(BaseComponent);

    expect(aesthetic.styles.BaseComponent).toEqual({
      button: {
        display: 'inline-block',
        padding: 5,
      },
    });
  });

  it('defines static styling methods', () => {
    const Wrapped = style(aesthetic)(BaseComponent);

    expect(Wrapped.extendStyles).toBeInstanceOf(Function);
  });

  it('can set styles using `extendStyles`', () => {
    const Wrapped = style(aesthetic, {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    }, {
      extendable: true,
    })(BaseComponent);

    expect(aesthetic.styles.BaseComponent).toEqual({
      button: {
        display: 'inline-block',
        padding: 5,
      },
    });

    Wrapped.extendStyles({
      notButton: {
        color: 'red',
      },
    }, {
      styleName: 'ExtendedComponent',
    });

    expect(aesthetic.styles.ExtendedComponent).toEqual({
      notButton: {
        color: 'red',
      },
    });
  });

  it('can set extended components as non-extendable', () => {
    const Wrapped = style(aesthetic, {}, {
      extendable: true,
    })(BaseComponent);

    const Extended = Wrapped.extendStyles({}, {
      extendable: false,
      styleName: 'ExtendedComponent',
    });

    expect(() => {
      Extended.extendStyles({});
    }).toThrowError('ExtendedComponent is not extendable.');
  });

  it('inherits theme from prop', () => {
    function ThemeComponent1(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic)(ThemeComponent1);
    const wrapper = shallow(<Wrapped themeName="classic" />);

    expect(wrapper.prop('themeName')).toBe('classic');
    expect(wrapper.prop('theme')).toEqual({ color: 'blue' });
  });

  it('inherits theme from context', () => {
    function ThemeComponent2(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic)(ThemeComponent2);
    const wrapper = shallow(<Wrapped />, {
      context: { themeName: 'classic' },
    });

    expect(wrapper.prop('themeName')).toBe('classic');
    expect(wrapper.prop('theme')).toEqual({ color: 'blue' });
  });

  it('inherits theme from Aesthetic options', () => {
    aesthetic.options.defaultTheme = 'default';

    function ThemeComponent3(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic)(ThemeComponent3);
    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('themeName')).toBe('default');
    expect(wrapper.prop('theme')).toEqual({ color: 'red' });
  });

  it('transforms styles on mount', () => {
    function StylesComponent1(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, TEST_STATEMENT)(StylesComponent1);

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.state('styles')).toEqual(TEST_STATEMENT);
  });

  it('transforms styles if theme changes', () => {
    function StylesComponent2(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, theme => ({
      wrapper: { color: theme.color },
    }))(StylesComponent2);

    const wrapper = shallow(<Wrapped themeName="default" />);
    const styles = wrapper.state('styles');

    expect(styles).toEqual({
      wrapper: { color: 'red' },
    });

    wrapper.setProps({
      themeName: 'classic',
    });

    const styles2 = wrapper.state('styles');

    expect(styles2).not.toEqual(styles);
    expect(styles2).toEqual({
      wrapper: { color: 'blue' },
    });
  });

  it('doesnt transforms styles if theme changes to the same name', () => {
    function StylesComponent2(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, theme => ({
      wrapper: { color: theme.color },
    }))(StylesComponent2);

    const wrapper = shallow(<Wrapped themeName="default" />);
    const styles = wrapper.state('styles');

    expect(styles).toEqual({
      wrapper: { color: 'red' },
    });

    wrapper.setProps({
      themeName: 'default',
    });

    const styles2 = wrapper.state('styles');

    expect(styles2).toEqual(styles);
  });


  it('doesnt transforms styles if other props change', () => {
    function StylesComponent2(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, theme => ({
      wrapper: { color: theme.color },
    }))(StylesComponent2);

    const wrapper = shallow(<Wrapped themeName="default" foo="123" />);
    const styles = wrapper.state('styles');

    expect(styles).toEqual({
      wrapper: { color: 'red' },
    });

    wrapper.setProps({
      foo: '456',
    });

    const styles2 = wrapper.state('styles');

    expect(styles2).toEqual(styles);
  });

  it('can customize the styles prop type using `options.stylesPropName`', () => {
    function StylesComponent3(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, TEST_STATEMENT, {
      stylesPropName: 'styleSheet',
    })(StylesComponent3);

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('styleSheet')).toEqual(TEST_STATEMENT);
  });

  it('can customize the options through the `Aesthetic` instance', () => {
    function StylesComponent4(props) {
      return <div />;
    }

    aesthetic = new Aesthetic(new TestAdapter(), {
      stylesPropName: 'styleSheet',
      themePropName: 'someThemeNameHere',
    });
    aesthetic.registerTheme('classic', {});

    const Wrapped = style(aesthetic, TEST_STATEMENT)(StylesComponent4);

    const wrapper = shallow(<Wrapped themeName="classic" />);

    expect(wrapper.prop('styleSheet')).toEqual(TEST_STATEMENT);
    expect(wrapper.prop('someThemeNameHere')).toEqual({});
  });

  it('errors if Aesthetic is not passed', () => {
    expect(() => {
      style()(BaseComponent);
    }).toThrowError('An instance of `Aesthetic` is required.');
  });

  it('errors if the same style name is used', () => {
    expect(() => {
      style(aesthetic)(BaseComponent);
      style(aesthetic)(BaseComponent);
    }).toThrowError('A component has already been styled under the name "BaseComponent". Either rename the component or define `options.styleName`.');
  });

  it('can bubble up the ref with `wrappedRef`', () => {
    // eslint-disable-next-line
    class StylesComponent5 extends React.Component {
      render() {
        return <div />;
      }
    }

    let refInstance = null;
    const Wrapped = style(aesthetic)(StylesComponent5);

    mount(<Wrapped themeName="classic" wrappedRef={(ref) => { refInstance = ref; }} />);

    expect(refInstance).not.toBeNull();
    expect(refInstance.constructor.name).toBe('StylesComponent5');
  });

  it('passes props to style function', () => {
    function StylesComponent4(props) {
      return <div />;
    }

    const spy = jest.spyOn(aesthetic, 'createStyleSheet');

    const Wrapped = style(aesthetic)(StylesComponent4);

    shallow(<Wrapped foo={123} bar="abc" baz />);

    expect(spy).toHaveBeenCalledWith('StylesComponent4', '', {
      bar: 'abc',
      baz: true,
      foo: 123,
      themeName: '',
      wrappedRef: null,
    });
  });

  it('passes SFC default props to style function', () => {
    function StylesComponent5(props) {
      return <div />;
    }

    StylesComponent5.defaultProps = {
      bar: 'abc',
      baz: true,
      foo: 123,
    };

    const spy = jest.spyOn(aesthetic, 'createStyleSheet');

    const Wrapped = style(aesthetic)(StylesComponent5);

    shallow(<Wrapped />);

    expect(spy).toHaveBeenCalledWith('StylesComponent5', '', {
      bar: 'abc',
      baz: true,
      foo: 123,
      themeName: '',
      wrappedRef: null,
    });
  });

  it('passes class component default props to style function', () => {
    // eslint-disable-next-line
    class StylesComponent6 extends React.Component {
      static defaultProps = {
        bar: 'abc',
        baz: true,
        foo: 123,
      };

      render() {
        return <div />;
      }
    }

    const spy = jest.spyOn(aesthetic, 'createStyleSheet');

    const Wrapped = style(aesthetic)(StylesComponent6);

    shallow(<Wrapped />);

    expect(spy).toHaveBeenCalledWith('StylesComponent6', '', {
      bar: 'abc',
      baz: true,
      foo: 123,
      themeName: '',
      wrappedRef: null,
    });
  });

  it('doesnt pass theme prop if `options.passThemeProp` is false', () => {
    function StylesComponent7(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, TEST_STATEMENT, {
      passThemeProp: false,
    })(StylesComponent7);

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('theme')).toBeUndefined();
  });

  it('doesnt pass themeName prop if `options.passThemeNameProp` is false', () => {
    function StylesComponent8(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, TEST_STATEMENT, {
      passThemeNameProp: false,
    })(StylesComponent8);

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('themeName')).toBeUndefined();
  });

  it('doesnt pass both props', () => {
    function StylesComponent8(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, TEST_STATEMENT, {
      passThemeNameProp: false,
      passThemeProp: false,
    })(StylesComponent8);

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('themeName')).toBeUndefined();
    expect(wrapper.prop('theme')).toBeUndefined();
  });
});
