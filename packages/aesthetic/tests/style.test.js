import React from 'react';
import { shallow } from 'enzyme';
import Aesthetic from '../src/Aesthetic';
import ThemeProvider from '../src/ThemeProvider';
import style from '../src/style';
import { TestAdapter, TEST_CLASS_NAMES } from '../../../tests/mocks';

function BaseComponent() {
  return null;
}

describe('aesthetic/style()', () => {
  let aesthetic;

  beforeEach(() => {
    aesthetic = new Aesthetic(new TestAdapter());
    aesthetic.registerTheme('classic', {});
  });

  it('extends `React.Component` by default', () => {
    const Wrapped = style(aesthetic)(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.Component);
  });

  it('extends `React.PureComponent` when `pure` is true', () => {
    const Wrapped = style(aesthetic, {}, { pure: true })(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
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

    expect(Wrapped.wrappedComponent).toBe(BaseComponent);
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
      styleName: 'ExtendedComponent',
      extendable: false,
    });

    expect(() => {
      Extended.extendStyles({});
    }).toThrowError('ExtendedComponent is not extendable.');
  });

  it('inherits theme name from prop', () => {
    function ThemeComponent(props) {
      expect(props.theme).toBe('classic');

      return null;
    }

    const Wrapped = style(aesthetic)(ThemeComponent);

    shallow(<Wrapped theme="classic" />).dive();
  });

  it('inherits theme name from context', () => {
    function ThemeComponent(props) {
      expect(props.theme).toBe('classic');

      return null;
    }

    const Wrapped = style(aesthetic)(ThemeComponent);

    shallow(<ThemeProvider name="classic"><Wrapped /></ThemeProvider>).dive();
  });

  it('transforms styles on mount', () => {
    function StylesComponent(props) {
      expect(props.classNames).toEqual(TEST_CLASS_NAMES);

      return null;
    }

    const Wrapped = style(aesthetic, {
      header: { color: 'red' },
      footer: { color: 'blue' },
    })(StylesComponent);

    expect(aesthetic.cache['StylesComponent:']).toBeUndefined();

    shallow(<Wrapped />).dive();

    expect(aesthetic.cache['StylesComponent:']).toEqual(TEST_CLASS_NAMES);
  });

  it('transforms styles if theme changes', () => {
    function StylesComponent(props) {
      expect(props.classNames).toEqual(TEST_CLASS_NAMES);

      return null;
    }

    const Wrapped = style(aesthetic, {
      header: { color: 'red' },
      footer: { color: 'blue' },
    })(StylesComponent);

    expect(aesthetic.cache['StylesComponent:']).toBeUndefined();
    expect(aesthetic.cache['StylesComponent:classic']).toBeUndefined();

    const wrapper = shallow(<Wrapped />);
    wrapper.dive();

    expect(aesthetic.cache['StylesComponent:']).toEqual(TEST_CLASS_NAMES);
    expect(aesthetic.cache['StylesComponent:classic']).toBeUndefined();

    wrapper.setProps({
      theme: 'classic',
    });

    expect(aesthetic.cache['StylesComponent:']).toEqual(TEST_CLASS_NAMES);
    expect(aesthetic.cache['StylesComponent:classic']).toEqual(TEST_CLASS_NAMES);
  });

  it('can customize the theme prop type using `options.themePropName`', () => {
    function ThemeComponent(props) {
      expect(props.someThemeNameHere).toBe('classic');

      return null;
    }

    const Wrapped = style(aesthetic, {}, {
      themePropName: 'someThemeNameHere',
    })(ThemeComponent);

    // eslint-disable-next-line
    expect(Wrapped.propTypes.someThemeNameHere).toBeDefined();

    shallow(<Wrapped someThemeNameHere="classic" />).dive();
  });

  it('can customize the class names prop type using `options.stylesPropName`', () => {
    function StylesComponent(props) {
      expect(props.classes).toEqual(TEST_CLASS_NAMES);

      return null;
    }

    const Wrapped = style(aesthetic, {
      header: { color: 'red' },
      footer: { color: 'blue' },
    }, {
      stylesPropName: 'classes',
    })(StylesComponent);

    shallow(<Wrapped />).dive();
  });

  it('can customize the options through the `Aesthetic` instance', () => {
    function StylesComponent(props) {
      expect(props.classes).toEqual(TEST_CLASS_NAMES);
      expect(props.someThemeNameHere).toBe('classic');

      return null;
    }

    aesthetic = new Aesthetic(new TestAdapter(), {
      stylesPropName: 'classes',
      themePropName: 'someThemeNameHere',
    });

    const Wrapped = style(aesthetic, {
      header: { color: 'red' },
      footer: { color: 'blue' },
    })(StylesComponent);

    // eslint-disable-next-line
    expect(Wrapped.propTypes.someThemeNameHere).toBeDefined();

    shallow(<Wrapped someThemeNameHere="classic" />).dive();
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
