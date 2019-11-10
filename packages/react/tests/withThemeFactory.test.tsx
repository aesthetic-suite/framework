import React from 'react';
import { render } from 'rut-dom';
import { TestAesthetic, registerTestTheme, TestTheme } from 'aesthetic/lib/testUtils';
import withThemeFactory from '../src/withThemeFactory';
import ThemeProvider from '../src/ThemeProvider';
import { ThemeProviderProps } from '../src/types';

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

  function WrappingComponent({ children }: { children?: React.ReactNode }) {
    return (
      <ThemeProvider aesthetic={aesthetic} name="light">
        {children || <div />}
      </ThemeProvider>
    );
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
    function ThemeComponent(props: { theme?: {} }) {
      return <div />;
    }

    const Wrapped = withTheme()(ThemeComponent);
    const { root } = render<{}>(<Wrapped />, { wrapper: <WrappingComponent /> });

    expect(root.findOne(ThemeComponent)).toHaveProp('theme', { color: 'black', unit: 8 });
  });

  it('can bubble up the ref with `wrappedRef`', () => {
    class RefComponent extends React.Component<any> {
      render() {
        return <div />;
      }
    }

    let refaesthetic: any = null;
    const Wrapped = withTheme()(RefComponent);

    render<{}>(
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
    const Wrapped = withTheme()(BaseComponent);
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider aesthetic={aesthetic}>
        <Wrapped />
      </ThemeProvider>,
    );

    expect(themeSpy).toHaveBeenCalledWith('default');

    update({ name: 'dark' });

    expect(themeSpy).toHaveBeenCalledWith('dark');
  });
});
