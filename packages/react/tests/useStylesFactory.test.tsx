import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { TestAesthetic, registerTestTheme, TEST_STATEMENT } from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
import ThemeProvider from '../src/ThemeProvider';
import useStylesFactory from '../src/useStylesFactory';

describe('useStylesFactory()', () => {
  let aesthetic: TestAesthetic;
  let useStyles: ReturnType<typeof useStylesFactory>;
  let styleName: string;
  let container: HTMLDivElement;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    useStyles = useStylesFactory(aesthetic);
    styleName = '';
    container = document.createElement('div');

    registerTestTheme(aesthetic);
  });

  function Component() {
    styleName = useStyles(() => TEST_STATEMENT)[2];

    return null;
  }

  function StyledComponent() {
    const [styles, cx, name] = useStyles(() => TEST_STATEMENT);

    styleName = name;

    return <div className={cx(styles.header, styles.footer)} />;
  }

  it('sets styles on the `Aesthetic` instance', () => {
    const styles = () => ({
      button: {
        display: 'inline-block',
        padding: 5,
      },
    });

    function ComponentCache() {
      styleName = useStyles(styles)[2];

      return null;
    }

    shallow(<ComponentCache />);

    expect(aesthetic.styles[styleName]).toBe(styles);
  });

  it('creates a style sheet', () => {
    const spy = jest.spyOn(aesthetic, 'createStyleSheet');

    shallow(<Component />);

    expect(spy).toHaveBeenCalledWith(styleName, { dir: 'ltr', name: styleName, theme: 'default' });
  });

  it('flushes styles only once', () => {
    const spy = jest.spyOn(aesthetic, 'flushStyles');

    act(() => {
      ReactDOM.render(<Component />, container);
    });

    act(() => {
      // Trigger layout effect
      ReactDOM.render(<Component />, container);
    });

    act(() => {
      // Check that its called once
      ReactDOM.render(<Component />, container);
    });

    expect(spy).toHaveBeenCalledWith(styleName);
    expect(spy).toHaveBeenCalledTimes(2); // Once for :root
  });

  it('only sets styles once', () => {
    const spy = jest.spyOn(aesthetic, 'registerStyleSheet');

    act(() => {
      ReactDOM.render(<StyledComponent />, container);
    });

    act(() => {
      // Check that its called once
      ReactDOM.render(<StyledComponent />, container);
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can transform class names', () => {
    const wrapper = shallow(<StyledComponent />);

    expect(wrapper.prop('className')).toBe('class-0 class-1');
  });

  it('re-creates style sheet if theme context changes', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');

    act(() => {
      ReactDOM.render(
        <ThemeProvider aesthetic={aesthetic}>
          <StyledComponent />
        </ThemeProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'default',
    });

    act(() => {
      ReactDOM.render(
        <ThemeProvider aesthetic={aesthetic} name="dark">
          <StyledComponent />
        </ThemeProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'dark',
    });
  });

  it('re-creates style sheet if direction context changes', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="rtl">
          <StyledComponent />
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'rtl',
      name: styleName,
      theme: 'default',
    });

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="ltr">
          <StyledComponent />
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'default',
    });
  });

  it('re-creates style sheet when both contexts change', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="ltr">
          <ThemeProvider aesthetic={aesthetic}>
            <StyledComponent />
          </ThemeProvider>
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'default',
    });

    act(() => {
      ReactDOM.render(
        <DirectionProvider aesthetic={aesthetic} dir="rtl">
          <ThemeProvider aesthetic={aesthetic} name="light">
            <StyledComponent />
          </ThemeProvider>
        </DirectionProvider>,
        container,
      );
    });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'rtl',
      name: styleName,
      theme: 'light',
    });
  });

  describe('RTL', () => {
    it('inherits `rtl` from explicit `DirectionProvider`', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      act(() => {
        ReactDOM.render(
          <DirectionProvider aesthetic={aesthetic} dir="rtl">
            <StyledComponent />
          </DirectionProvider>,
          container,
        );
      });

      expect(createSpy).toHaveBeenCalledWith(styleName, {
        dir: 'rtl',
        name: styleName,
        theme: 'default',
      });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], {
        dir: 'rtl',
        name: styleName,
        theme: 'default',
      });
    });

    it('inherits `rtl` from inferred `DirectionProvider` value', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      act(() => {
        ReactDOM.render(
          <DirectionProvider aesthetic={aesthetic} value="بسيطة">
            <StyledComponent />
          </DirectionProvider>,
          container,
        );
      });

      expect(createSpy).toHaveBeenCalledWith(styleName, {
        dir: 'rtl',
        name: styleName,
        theme: 'default',
      });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], {
        dir: 'rtl',
        name: styleName,
        theme: 'default',
      });
    });
  });
});
