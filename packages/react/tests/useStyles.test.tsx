import React from 'react';
import { render } from 'rut-dom';
import aesthetic from 'aesthetic';
import { setupAesthetic, teardownAesthetic, TEST_STATEMENT } from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
import ThemeProvider from '../src/ThemeProvider';
import useStyles from '../src/useStyles';
import { DirectionProviderProps, ThemeProviderProps } from '../src/types';

describe('useStyles()', () => {
  let styleName: string;

  beforeEach(() => {
    styleName = '';

    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
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

    render<{}>(<ComponentCache />);

    expect(aesthetic.styleSheets[styleName]).toBe(styles);
  });

  it('creates a style sheet', () => {
    const spy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');

    render<{}>(<Component />);

    expect(spy).toHaveBeenCalledWith(styleName, { dir: 'ltr', name: styleName, theme: '' });
  });

  it('flushes styles only once', () => {
    const spy = jest.spyOn(aesthetic.getAdapter(), 'flushStyles');
    const { update } = render<{}>(<Component />);

    update();
    update();
    update();

    expect(spy).toHaveBeenCalledWith(styleName);
    expect(spy).toHaveBeenCalledTimes(2); // Once for :root
  });

  it('only sets styles once', () => {
    const spy = jest.spyOn(aesthetic, 'registerStyleSheet');
    const { update } = render<{}>(<StyledComponent />);

    update();
    update();
    update();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can transform class names', () => {
    const { root } = render<{}>(<StyledComponent />);

    expect(root.findOne('div')).toHaveProp('className', 'header footer');
  });

  it('re-creates style sheet if theme context changes', () => {
    const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const { update } = render<ThemeProviderProps>(
      <ThemeProvider>
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
    const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const { update } = render<DirectionProviderProps>(
      <DirectionProvider dir="rtl">
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
    const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
    const { rerender } = render<DirectionProviderProps>(
      <DirectionProvider dir="ltr">
        <ThemeProvider>
          <StyledComponent />
        </ThemeProvider>
      </DirectionProvider>,
    );

    expect(createSpy).toHaveBeenCalledWith(styleName, {
      dir: 'ltr',
      name: styleName,
      theme: 'default',
    });

    rerender(
      <DirectionProvider dir="rtl">
        <ThemeProvider name="light">
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
      const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic.getAdapter(), 'transformStyles');

      render<DirectionProviderProps>(
        <DirectionProvider dir="rtl">
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
      const createSpy = jest.spyOn(aesthetic.getAdapter(), 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic.getAdapter(), 'transformStyles');

      render<DirectionProviderProps>(
        <DirectionProvider value="بسيطة">
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
