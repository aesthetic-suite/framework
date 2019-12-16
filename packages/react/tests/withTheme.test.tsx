import React from 'react';
import { render } from 'rut-dom';
import aesthetic from 'aesthetic';
import { setupAesthetic, teardownAesthetic } from 'aesthetic/lib/testUtils';
import withTheme from '../src/withTheme';
import ThemeProvider from '../src/ThemeProvider';
import { ThemeProviderProps } from '../src/types';

describe('withThemeFactory()', () => {
  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  function BaseComponent() {
    return null;
  }

  function WrappingComponent({ children }: { children?: React.ReactNode }) {
    return <ThemeProvider name="light">{children || <div />}</ThemeProvider>;
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

    expect(root.findOne(ThemeComponent)).toHaveProp('theme', {
      bg: 'white',
      color: 'black',
      unit: 8,
    });
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
      <ThemeProvider>
        <Wrapped />
      </ThemeProvider>,
    );

    expect(themeSpy).toHaveBeenCalledWith('default');

    update({ name: 'dark' });

    expect(themeSpy).toHaveBeenCalledWith('dark');
  });
});
