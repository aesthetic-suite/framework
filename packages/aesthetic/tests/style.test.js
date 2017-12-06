import React from 'react';
import { shallow } from 'enzyme';
import Aesthetic from '../src/Aesthetic'
import style from '../src/style';
import { TestAdapter, TEST_CLASS_NAMES } from '../../../tests/mocks';

function BaseComponent() {
  return null;
}

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

    const Wrapped = style(aesthetic, {
      footer: { color: 'blue' },
      header: { color: 'red' },
    })(StylesComponent1);

    expect(aesthetic.cache['StylesComponent1:']).toBeUndefined();

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('classNames')).toEqual(TEST_CLASS_NAMES);

    expect(aesthetic.cache['StylesComponent1:']).toEqual(TEST_CLASS_NAMES);
  });

  it('transforms styles if theme changes', () => {
    function StylesComponent2(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, {
      footer: { color: 'blue' },
      header: { color: 'red' },
    })(StylesComponent2);

    expect(aesthetic.cache['StylesComponent2:']).toBeUndefined();
    expect(aesthetic.cache['StylesComponent2:classic']).toBeUndefined();

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('classNames')).toEqual(TEST_CLASS_NAMES);

    expect(aesthetic.cache['StylesComponent2:']).toEqual(TEST_CLASS_NAMES);
    expect(aesthetic.cache['StylesComponent2:classic']).toBeUndefined();

    wrapper.setProps({
      themeName: 'classic',
    });

    expect(aesthetic.cache['StylesComponent2:']).toEqual(TEST_CLASS_NAMES);
    expect(aesthetic.cache['StylesComponent2:classic']).toEqual(TEST_CLASS_NAMES);
  });

  it('can customize the class names prop type using `options.stylesPropName`', () => {
    function StylesComponent3(props) {
      return <div />;
    }

    const Wrapped = style(aesthetic, {
      footer: { color: 'blue' },
      header: { color: 'red' },
    }, {
      stylesPropName: 'classes',
    })(StylesComponent3);

    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('classes')).toEqual(TEST_CLASS_NAMES);
  });

  it('can customize the options through the `Aesthetic` instance', () => {
    function StylesComponent4(props) {
      return <div />;
    }

    aesthetic = new Aesthetic(new TestAdapter(), {
      stylesPropName: 'classes',
      themePropName: 'someThemeNameHere',
    });
    aesthetic.registerTheme('classic', {});

    const Wrapped = style(aesthetic, {
      footer: { color: 'blue' },
      header: { color: 'red' },
    })(StylesComponent4);

    const wrapper = shallow(<Wrapped themeName="classic" />);

    expect(wrapper.prop('classes')).toEqual(TEST_CLASS_NAMES);
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
});
