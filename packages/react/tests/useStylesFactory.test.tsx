import React from 'react';
import { render } from 'rut';
import {
  TestAesthetic,
  registerTestTheme,
  TEST_STATEMENT,
  TestTheme,
} from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
import ThemeProvider from '../src/ThemeProvider';
import useStylesFactory from '../src/useStylesFactory';

describe('useStylesFactory()', () => {
  let aesthetic: TestAesthetic<TestTheme>;
  let useStyles: ReturnType<typeof useStylesFactory>;
  let styleName: string;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    useStyles = useStylesFactory(aesthetic) as any;
    styleName = '';

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

    render(<ComponentCache />);

    expect(aesthetic.styles[styleName]).toBe(styles);
  });

  it('creates a style sheet', () => {
    const spy = jest.spyOn(aesthetic, 'createStyleSheet');

    render(<Component />);

    expect(spy).toHaveBeenCalledWith(styleName, { dir: 'ltr', name: styleName, theme: '' });
  });

  it('flushes styles only once', () => {
    const spy = jest.spyOn(aesthetic, 'flushStyles');
    const { update } = render(<Component />);

    update();
    update();
    update();

    expect(spy).toHaveBeenCalledWith(styleName);
    expect(spy).toHaveBeenCalledTimes(2); // Once for :root
  });

  it('only sets styles once', () => {
    const spy = jest.spyOn(aesthetic, 'registerStyleSheet');
    const { update } = render(<StyledComponent />);

    update();
    update();
    update();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can transform class names', () => {
    const { root } = render(<StyledComponent />);

    expect(root.findOne('div')).toHaveProp('className', 'header footer');
  });

  it('re-creates style sheet if theme context changes', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
    const { update } = render(
      <ThemeProvider aesthetic={aesthetic}>
        <StyledComponent />
      </ThemeProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'default',
    });

    update({ name: 'dark' });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'dark',
    });
  });

  it('re-creates style sheet if direction context changes', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
    const { update } = render(
      <DirectionProvider aesthetic={aesthetic} dir="rtl">
        <StyledComponent />
      </DirectionProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'rtl',
      name: styleName,
      theme: '',
    });

    update({ dir: 'ltr' });

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: '',
    });
  });

  it('re-creates style sheet when both contexts change', () => {
    const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
    const { update } = render(
      <DirectionProvider aesthetic={aesthetic} dir="ltr">
        <ThemeProvider aesthetic={aesthetic}>
          <StyledComponent />
        </ThemeProvider>
      </DirectionProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'default',
    });

    update(
      <DirectionProvider aesthetic={aesthetic} dir="rtl">
        <ThemeProvider aesthetic={aesthetic} name="light">
          <StyledComponent />
        </ThemeProvider>
      </DirectionProvider>,
    );

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

      render(
        <DirectionProvider aesthetic={aesthetic} dir="rtl">
          <StyledComponent />
        </DirectionProvider>,
      );

      expect(createSpy).toHaveBeenCalledWith(styleName, {
        dir: 'rtl',
        name: styleName,
        theme: '',
      });
      expect(transformSpy).toHaveBeenCalledWith(['header', 'footer'], {
        dir: 'rtl',
        name: styleName,
        theme: '',
      });
    });

    it('inherits `rtl` from inferred `DirectionProvider` value', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      render(
        <DirectionProvider aesthetic={aesthetic} value="بسيطة">
          <StyledComponent />
        </DirectionProvider>,
      );

      expect(createSpy).toHaveBeenCalledWith(styleName, {
        dir: 'rtl',
        name: styleName,
        theme: '',
      });
      expect(transformSpy).toHaveBeenCalledWith(['header', 'footer'], {
        dir: 'rtl',
        name: styleName,
        theme: '',
      });
    });
  });
});
