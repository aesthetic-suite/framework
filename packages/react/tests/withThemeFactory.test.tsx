import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { TestAesthetic, registerTestTheme, TestTheme } from 'aesthetic/lib/testUtils';
import withThemeFactory from '../src/withThemeFactory';
import ThemeProvider from '../src/ThemeProvider';

describe('withThemeFactory()', () => {
  let aesthetic: TestAesthetic<TestTheme>;
  let withTheme: ReturnType<typeof withThemeFactory>;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    registerTestTheme(aesthetic);

    withTheme = withThemeFactory(aesthetic);
  });

  function BaseComponent() {
    return null;
  }

  function WrappingComponent({ children }: any) {
    return (
      <ThemeProvider aesthetic={aesthetic} name="light">
        {children}
      </ThemeProvider>
    );
  }

  function shallowDeep(element: React.ReactElement<any>) {
    return shallow(element, {
      // @ts-ignore Not yet typed
      wrappingComponent: WrappingComponent,
    });
  }

  it('returns an HOC component', () => {
    const hoc = withTheme();

    expect(hoc).toBeInstanceOf(Function);
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
    const wrapper = shallowDeep(<Wrapped />);

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

  it('returns new theme if theme context changes', () => {
    const themeSpy = jest.spyOn(aesthetic, 'getTheme');
    const container = document.createElement('div');
    const Wrapped = withTheme()(BaseComponent);

    act(() => {
      ReactDOM.render(
        <ThemeProvider aesthetic={aesthetic}>
          <Wrapped />
        </ThemeProvider>,
        container,
      );
    });

    expect(themeSpy).toHaveBeenCalledWith('default');

    act(() => {
      ReactDOM.render(
        <ThemeProvider aesthetic={aesthetic} name="dark">
          <Wrapped />
        </ThemeProvider>,
        container,
      );
    });

    expect(themeSpy).toHaveBeenCalledWith('dark');
  });
});
