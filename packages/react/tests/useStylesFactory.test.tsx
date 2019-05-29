import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { TestAesthetic, registerTestTheme, TEST_STATEMENT } from 'aesthetic/lib/testUtils';
import DirectionProvider from '../src/DirectionProvider';
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

  it('sets styles on the `Aesthetic` instance', () => {
    const styles = () => ({
      button: {
        display: 'inline-block',
        padding: 5,
      },
    });

    function Component() {
      styleName = useStyles(styles)[2];

      return null;
    }

    shallow(<Component />);

    expect(aesthetic.styles[styleName]).toBe(styles);
  });

  it('creates a style sheet', () => {
    const spy = jest.spyOn(aesthetic, 'createStyleSheet');

    function Component() {
      styleName = useStyles(() => TEST_STATEMENT)[2];

      return null;
    }

    shallow(<Component />);

    expect(spy).toHaveBeenCalledWith(styleName, { name: styleName, rtl: false });
  });

  it('flushes styles only once', () => {
    const spy = jest.spyOn(aesthetic, 'flushStyles');

    function Component() {
      styleName = useStyles(() => TEST_STATEMENT)[2];

      return null;
    }

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
    const spy = jest.spyOn(aesthetic, 'setStyleSheet');

    function Component() {
      styleName = useStyles(() => TEST_STATEMENT)[2];

      return null;
    }

    act(() => {
      ReactDOM.render(<Component />, container);
    });

    act(() => {
      // Check that its called once
      ReactDOM.render(<Component />, container);
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can transform class names', () => {
    function Component() {
      const [styles, cx] = useStyles(() => TEST_STATEMENT);

      return <div className={cx(styles.header, styles.footer)} />;
    }

    const wrapper = shallow(<Component />);

    expect(wrapper.prop('className')).toBe('class-0 class-1');
  });

  describe('RTL', () => {
    function Component() {
      const [styles, cx, name] = useStyles(() => TEST_STATEMENT);

      styleName = name;

      return <div className={cx(styles.header, styles.footer)} />;
    }

    it('inherits `rtl` from `Aesthetic` option', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      aesthetic.options.rtl = true;

      act(() => {
        ReactDOM.render(<Component />, container);
      });

      expect(createSpy).toHaveBeenCalledWith(styleName, { name: styleName, rtl: true });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], { name: styleName, rtl: true });
    });

    it('inherits `rtl` from explicit `DirectionProvider`', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      act(() => {
        ReactDOM.render(
          <DirectionProvider dir="rtl">
            <Component />
          </DirectionProvider>,
          container,
        );
      });

      expect(createSpy).toHaveBeenCalledWith(styleName, { name: styleName, rtl: true });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], { name: styleName, rtl: true });
    });

    it('inherits `rtl` from inferred `DirectionProvider` value', () => {
      const createSpy = jest.spyOn(aesthetic, 'createStyleSheet');
      const transformSpy = jest.spyOn(aesthetic, 'transformStyles');

      act(() => {
        ReactDOM.render(
          <DirectionProvider value="بسيطة">
            <Component />
          </DirectionProvider>,
          container,
        );
      });

      expect(createSpy).toHaveBeenCalledWith(styleName, { name: styleName, rtl: true });
      expect(transformSpy).toHaveBeenCalledWith([{}, {}], { name: styleName, rtl: true });
    });

    it.todo('re-creates a style sheet if provider context changes');
  });
});
