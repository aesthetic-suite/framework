import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { TestAesthetic, registerTestTheme, TEST_STATEMENT } from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
import ThemeProvider from '../src/ThemeProvider';
import withStylesFactory from '../src/withStylesFactory';

describe('withStylesFactory()', () => {
  let aesthetic: TestAesthetic;
  let withStyles: ReturnType<typeof withStylesFactory>;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    registerTestTheme(aesthetic);

    withStyles = withStylesFactory(aesthetic);
  });

  function BaseComponent() {
    return null;
  }

  function StyledComponent({ styles, cx }: any) {
    return <div className={cx(styles.header, styles.footer)} />;
  }

  function WrappingComponent({ children }: any) {
    return (
      <DirectionProvider aesthetic={aesthetic} dir="ltr">
        <ThemeProvider aesthetic={aesthetic} name="light">
          {children}
        </ThemeProvider>
      </DirectionProvider>
    );
  }

  function shallowDeep(element: React.ReactElement<any>) {
    return shallow(element, {
      // @ts-ignore Not yet typed
      wrappingComponent: WrappingComponent,
    });
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

    shallowDeep(<Wrapped />);

    expect(aesthetic.styles[Wrapped.styleName]).toBe(styles);
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

    expect(aesthetic.getStyleSheet(Wrapped.styleName)).toEqual({
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

    expect(aesthetic.getStyleSheet(Extended.styleName)).toEqual({
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
    const wrapper = shallowDeep(<Wrapped />);

    expect(typeof wrapper.prop('cx')).toBe('function');
  });

  it('inherits theme from Aesthetic options', () => {
    function ThemeComponent() {
      return <div />;
    }

    const Wrapped = withStyles(() => ({}), { passThemeProp: true })(ThemeComponent);
    const wrapper = shallowDeep(<Wrapped />);

    expect(wrapper.prop('theme')).toEqual({ color: 'black', unit: 8 });
  });

  it('creates a style sheet', () => {
    const spy = jest.spyOn(aesthetic, 'createStyleSheet');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

    shallowDeep(<Wrapped foo="abc" />);

    expect(spy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: '',
    });
  });

  it('can customize props with options', () => {
    aesthetic.options.passThemeProp = true;

    const Wrapped = withStyles(() => TEST_STATEMENT, {
      cxPropName: 'css',
      stylesPropName: 'styleSheet',
      themePropName: 'someThemeNameHere',
    })(StyledComponent);
    const wrapper = shallowDeep(<Wrapped />);

    expect(wrapper.prop('css')).toBeDefined();
    expect(wrapper.prop('styleSheet')).toBeDefined();
    expect(wrapper.prop('someThemeNameHere')).toBeDefined();
  });

  it('can customize props with the options through the `Aesthetic` instance', () => {
    aesthetic.options.cxPropName = 'css';
    aesthetic.options.stylesPropName = 'styleSheet';
    aesthetic.options.themePropName = 'someThemeNameHere';
    aesthetic.options.passThemeProp = true;

    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);
    const wrapper = shallowDeep(<Wrapped />);

    expect(wrapper.prop('css')).toBeDefined();
    expect(wrapper.prop('styleSheet')).toBeDefined();
    expect(wrapper.prop('someThemeNameHere')).toBeDefined();
  });

  it('doesnt pass theme prop if `options.passThemeProp` is false', () => {
    const Wrapped = withStyles(() => TEST_STATEMENT, { passThemeProp: false })(StyledComponent);
    const wrapper = shallowDeep(<Wrapped />);

    expect(wrapper.prop('theme')).toBeUndefined();
  });

  it('can bubble up the ref with `wrappedRef`', () => {
    class RefComponent extends React.Component<any> {
      render() {
        return <div />;
      }
    }

    let refInstance: any = null;
    const Wrapped = withStyles(() => ({}))(RefComponent);

    mount(
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
      return <div className={cx(styles.header, styles.footer)} />;
    }

    const Wrapped = withStyles(() => TEST_STATEMENT)(Component);
    const wrapper = shallowDeep(<Wrapped />).dive();

    expect(wrapper.prop('className')).toBe('class-0 class-1');
  });

  it('re-creates style sheet if theme context changes', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
    const container = document.createElement('div');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

    act(() => {
      ReactDOM.render(
        <ThemeProvider aesthetic={aesthetic}>
          <Wrapped />
        </ThemeProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'default',
    });

    act(() => {
      ReactDOM.render(
        <ThemeProvider aesthetic={aesthetic} name="dark">
          <Wrapped />
        </ThemeProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'dark',
    });
  });

  it('re-creates style sheet if direction context changes', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
    const container = document.createElement('div');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="rtl">
          <Wrapped />
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'rtl',
      name: Wrapped.styleName,
      theme: '',
    });

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="ltr">
          <Wrapped />
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: '',
    });
  });

  it('re-creates style sheet when both contexts change', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
    const container = document.createElement('div');
    const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="ltr">
          <ThemeProvider aesthetic={aesthetic}>
            <Wrapped />
          </ThemeProvider>
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'ltr',
      name: Wrapped.styleName,
      theme: 'default',
    });

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="rtl">
          <ThemeProvider aesthetic={aesthetic} name="light">
            <Wrapped />
          </ThemeProvider>
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
      dir: 'rtl',
      name: Wrapped.styleName,
      theme: 'light',
    });
  });

  describe('RTL', () => {
    it('inherits `rtl` from explicit `DirectionProvider`', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

      act(() => {
        ReactDOM.render(
          <DirectionProvider aesthetic={aesthetic} dir="rtl">
            <Wrapped />
          </DirectionProvider>,
          document.createElement('div'),
        );
      });

      expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
    });

    it('inherits `rtl` from inferred `DirectionProvider` value', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      const Wrapped = withStyles(() => TEST_STATEMENT)(StyledComponent);

      act(() => {
        ReactDOM.render(
          <DirectionProvider aesthetic={aesthetic} value="بسيطة">
            <Wrapped />
          </DirectionProvider>,
          document.createElement('div'),
        );
      });

      expect(createSpy).toHaveBeenCalledWith(Wrapped.styleName, {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], {
        dir: 'rtl',
        name: Wrapped.styleName,
        theme: '',
      });
    });
  });
});
