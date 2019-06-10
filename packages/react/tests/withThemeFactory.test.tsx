import React from 'react';
import { shallow, mount } from 'enzyme';
import { TestAesthetic, registerTestTheme } from 'aesthetic/lib/testUtils';
import withThemeFactory from '../src/withThemeFactory';

describe('withThemeFactory()', () => {
  let aesthetic: TestAesthetic;
  let withTheme: ReturnType<typeof withThemeFactory>;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    withTheme = withThemeFactory(aesthetic);

    registerTestTheme(aesthetic);
  });

  function BaseComponent() {
    return null;
  }

  it('returns an HOC component', () => {
    const hoc = withTheme();

    expect(hoc).toBeInstanceOf(Function);
  });

  it('extends `React.PureComponent` by default', () => {
    const Wrapped = withTheme()(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
  });

  it('extends `React.Component` when `pure` is false', () => {
    const Wrapped = withTheme({ pure: false })(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.Component);
  });

  it('extends `React.PureComponent` when Aesthetic option `pure` is true', () => {
    aesthetic.options.pure = true;

    const Wrapped = withTheme()(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).toBe(React.PureComponent);
  });

  it('doesnt extend `React.PureComponent` when Aesthetic option `pure` is true but local is false', () => {
    aesthetic.options.pure = true;

    const Wrapped = withTheme({ pure: false })(BaseComponent);

    expect(Object.getPrototypeOf(Wrapped)).not.toBe(React.PureComponent);
  });

  it('inherits name from component `constructor.name`', () => {
    const Wrapped = withTheme()(BaseComponent);

    expect(Wrapped.displayName).toBe('withTheme(BaseComponent)');
  });

  it('inherits name from component `displayName`', () => {
    class DisplayComponent extends React.Component<any> {
      static displayName = 'CustomDisplayName';

      render() {
        return null;
      }
    }

    const Wrapped = withTheme()(DisplayComponent);

    expect(Wrapped.displayName).toBe('withTheme(CustomDisplayName)');
  });

  it('stores the original component as a static property', () => {
    const Wrapped = withTheme()(BaseComponent);

    // @ts-ignore
    expect(Wrapped.WrappedComponent).toBe(BaseComponent);
  });

  it('inherits theme from Aesthetic options', () => {
    function ThemeComponent() {
      return <div />;
    }

    const Wrapped = withTheme()(ThemeComponent);
    const wrapper = shallow(<Wrapped />);

    expect(wrapper.prop('theme')).toEqual({ color: 'black', unit: 8 });
  });

  it('can bubble up the ref with `wrappedRef`', () => {
    class RefComponent extends React.Component<any> {
      render() {
        return <div />;
      }
    }

    let refaesthetic: any = null;
    const Wrapped = withTheme()(RefComponent);

    mount(
      <Wrapped
        themeName="classic"
        wrappedRef={(ref: any) => {
          refaesthetic = ref;
        }}
      />,
    );

    expect(refaesthetic).not.toBeNull();
    expect(refaesthetic!.constructor.name).toBe('RefComponent');
  });
});
