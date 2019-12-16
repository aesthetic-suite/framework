import React from 'react';
import { render } from 'rut-dom';
import aesthetic from 'aesthetic';
import { setupAesthetic, teardownAesthetic, TEST_STATEMENT } from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
import ThemeProvider from '../src/ThemeProvider';
import withStyles from '../src/withStyles';
import { ThemeProviderProps, DirectionProviderProps } from '../src/types';

describe('withStyles()', () => {
  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  function BaseComponent(props: any) {
    return null;
  }

  function StyledComponent({ styles, cx }: any) {
    return <div className={cx(styles.header, styles.footer)} />;
  }

  function WrappingComponent({ children }: { children?: React.ReactNode }) {
    return (
      <DirectionProvider dir="ltr">
        <ThemeProvider name="light">{children || <div />}</ThemeProvider>
      </DirectionProvider>
    );
  }

  function renderWithWrapper(element: React.ReactElement) {
    return render(element, { wrapper: <WrappingComponent /> });
  }

  it('returns an HOC component', () => {
    const hoc = withStyles(() => ({}));

    expect(hoc).toBeInstanceOf(Function);
  });

  it('inherits name from component `constructor.name`', () => {
    const Wrapped = withStyles(() => ({}))(BaseComponent);

    expect(Wrapped.displayName).toBe('withStyles(BaseComponent)');
    expect(Wrapped.styleName).toEqual(expect.stringMatching(/^BaseComponent/u));
  });

  it('inherits name from component `displayName`', () => {
    class DisplayComponent extends React.Component<any> {
      static displayName = 'CustomDisplayName';

      render() {
        return null;
      }
    }

    const Wrapped = withStyles(() => ({}))(DisplayComponent);

    expect(Wrapped.displayName).toBe('withStyles(CustomDisplayName)');
    expect(Wrapped.styleName).toEqual(expect.stringMatching(/^CustomDisplayName/u));
  });

  it('stores the original component as a static property', () => {
    const Wrapped = withStyles(() => ({}))(BaseComponent);

    expect(Wrapped.WrappedComponent).toBe(BaseComponent);
  });

  it('defines static method for extending styles', () => {
    const Wrapped = withStyles(() => ({}))(BaseComponent);

    expect(Wrapped.extendStyles).toBeInstanceOf(Function);
  });

  it('sets styles on the `Aesthetic` instance', () => {
    const styles = () => ({
      button: {
        display: 'inline-block',
        padding: 5,
      },
    });
    const Wrapped = withStyles(styles)(BaseComponent);

    renderWithWrapper(<Wrapped />);

    expect(aesthetic.styleSheets[Wrapped.styleName]).toBe(styles);
  });

  it('can set styles using `extendStyles`', () => {
    const Wrapped = withStyles(
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

    expect(aesthetic.getStyleSheet(Wrapped.styleName, 'default')).toEqual({
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

    expect(aesthetic.getStyleSheet(Extended.styleName, 'default')).toEqual({
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
    const Wrapped = withStyles(() => ({}), {
      extendable: true,
    })(BaseComponent);

    const Extended = Wrapped.extendStyles(() => ({}), {
      extendable: false,
    });

    expect(() => {
      Extended.extendStyles(() => ({}));
    }).toThrowErrorMatchingSnapshot();
  });

  it('inherits a function to generate CSS class names', () => {
    const Wrapped = withStyles(() => ({}))(BaseComponent);
    const { root } = renderWithWrapper(<Wrapped />);

    expect(root.findOne(BaseComponent)).toHaveProp('cx');
  });

  it('inherits theme from Aesthetic options', () => {
    function ThemeComponent(props: { theme?: {} }) {
      return <div />;
    }

    const Wrapped = withStyles(() => ({}), { passThemeProp: true })(ThemeComponent);
    const { root } = renderWithWrapper(<Wrapped />);

    expect(root.findOne(ThemeComponent)).toHaveProp('theme', {
      bg: 'white',
      color: 'black',
      unit: 8,
    });
  });

  it('creates a style sheet', () => {
    const spy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

    renderWithWrapper(<Wrapped foo="abc" />);

    expect(spy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'light',
    });
  });

  it('can customize props with options', () => {
    aesthetic.configure({
      passThemeProp: true,
    });

    function CustomStyledComponent({ styleSheet, css }: any) {
      return <div className={css(styleSheet.header, styleSheet.footer)} />;
    }

    const Wrapped = withStyles(() => TEST_STATEMENT, {
      cxPropName: 'css',
      stylesPropName: 'styleSheet',
      themePropName: 'someThemeNameHere',
    })(CustomStyledComponent);
    const { root } = renderWithWrapper(<Wrapped />);
    const found = root.findOne(CustomStyledComponent);

    expect(found).toHaveProp('css');
    expect(found).toHaveProp('styleSheet');
    expect(found).toHaveProp('someThemeNameHere');
  });

  it('can customize props with the options through the `Aesthetic` instance', () => {
    aesthetic.configure({
      cxPropName: 'css',
      stylesPropName: 'styleSheet',
      themePropName: 'someThemeNameHere',
      passThemeProp: true,
    });

    function CustomStyledComponent({ styleSheet, css }: any) {
      return <div className={css(styleSheet.header, styleSheet.footer)} />;
    }

    const Wrapped = withStyles(() => TEST_STATEMENT)(CustomStyledComponent);
    const { root } = renderWithWrapper(<Wrapped />);
    const found = root.findOne(CustomStyledComponent);

    expect(found).toHaveProp('css');
    expect(found).toHaveProp('styleSheet');
    expect(found).toHaveProp('someThemeNameHere');
  });

  it('doesnt pass theme prop if `options.passThemeProp` is false', () => {
    const Wrapped = withStyles(() => TEST_STATEMENT, { passThemeProp: false })(StyledComponent);
    const { root } = renderWithWrapper(<Wrapped />);

    expect(root.findOne(StyledComponent)).not.toHaveProp('theme');
  });

  it('can bubble up the ref with `wrappedRef`', () => {
    class RefComponent extends React.Component<any> {
      render() {
        return <div />;
      }
    }

    let refInstance: any = null;
    const Wrapped = withStyles(() => ({}))(RefComponent);

    render<{}>(
      <Wrapped
        themeName="classic"
        wrappedRef={(ref: any) => {
          refInstance = ref;
        }}
      />,
    );

    expect(refInstance).not.toBeNull();
    expect(refInstance!.constructor.name).toBe('RefComponent');
  });

  it('can transform class names', () => {
    function Component({ cx, styles }: any) {
      return <section className={cx(styles.header, styles.footer)} />;
    }

    const Wrapped = withStyles(() => TEST_STATEMENT)(Component);
    const { root } = renderWithWrapper(<Wrapped />);

    expect(root.findOne('section')).toHaveProp('className', 'header footer');
  });

  it('re-creates style sheet if theme context changes', () => {
    const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider>
        <Wrapped />
      </ThemeProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'default',
    });

    update({ name: 'dark' });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'dark',
    });
  });

  it('re-creates style sheet if direction context changes', () => {
    const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);
    const { update } = render<DirectionProviderProps>(
      <DirectionProvider dir="rtl">
        <Wrapped />
      </DirectionProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'rtl',
      name: Wrapped.styleName,
      theme: '',
    });

    update({ dir: 'ltr' });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: '',
    });
  });

  it('re-creates style sheet when both contexts change', () => {
    const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);
    const { rerender } = render<DirectionProviderProps>(
      <DirectionProvider dir="ltr">
        <ThemeProvider>
          <Wrapped />
        </ThemeProvider>
      </DirectionProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'default',
    });

    rerender(
      <DirectionProvider dir="rtl">
        <ThemeProvider name="light">
          <Wrapped />
        </ThemeProvider>
      </DirectionProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'rtl',
      name: Wrapped.styleName,
      theme: 'light',
    });
  });

  describe('RTL', () => {
    it('inherits `rtl` from explicit `DirectionProvider`', () => {
      const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic.getAdapter(), 'transformStyles');
      const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

      render<DirectionProviderProps>(
        <DirectionProvider dir="rtl">
          <Wrapped />
        </DirectionProvider>,
      );

      expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
      expect(transformSpy).toHaveBeenCalledWith(['header', 'footer'], {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
    });

    it('inherits `rtl` from inferred `DirectionProvider` value', () => {
      const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic.getAdapter(), 'transformStyles');
      const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

      render<DirectionProviderProps>(
        <DirectionProvider value="بسيطة">
          <Wrapped />
        </DirectionProvider>,
      );

      expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
      expect(transformSpy).toHaveBeenCalledWith(['header', 'footer'], {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
    });
  });
});
