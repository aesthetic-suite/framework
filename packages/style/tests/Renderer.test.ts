import Renderer from '../src/Renderer';

describe('Renderer', () => {
  let renderer: Renderer;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    renderer = new Renderer();

    // Stub so that we can flush immediately
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(Date.now());

      // Return 0 so that timer is always falsy
      return 0;
    });

    // Avoid warnings
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('generates a unique class name for each property', () => {
    const className = renderer.render({
      margin: 0,
      padding: '6px 12px',
      border: '1px solid #2e6da4',
      borderRadius: 4,
      display: 'inline-block',
      cursor: 'pointer',
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      lineHeight: 'normal',
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      textAlign: 'left',
      backgroundColor: '#337ab7',
      verticalAlign: 'middle',
      color: 'rgba(0, 0, 0, 0)',
      animationName: 'fade',
      animationDuration: '.3s',
    });

    expect(className).toBe(
      '13kbekr fj61tt 1pue5r2 odvm0w 169hbqq 16r1ggk 1c05vza 16weknc wyq6ru 1a0rdy6 1dh7ri5 1sl4fpf 9tlqaj g4y2l6 1o2fiv7 1ql63jz rwfe5q',
    );
    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('generates a unique class name for each selector even if property value pair is the same', () => {
    const className = renderer.render({
      background: '#000',
      ':hover': {
        background: '#000',
      },
      '[disable]': {
        background: '#000',
      },
    });

    expect(className).toBe('1yedsjc yb3jac t5sg0a');
    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('uses the same class name for the same property value pair', () => {
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'inline');
    renderer.renderDeclaration('display', 'block');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('uses the same class name for dashed and camel cased properties', () => {
    renderer.renderDeclaration('textDecoration', 'none');
    renderer.renderDeclaration('text-decoration', 'none');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('uses the same class name for numeric and string values', () => {
    renderer.renderDeclaration('width', 100);
    renderer.renderDeclaration('width', '100px');
    renderer.renderDeclaration('width', '100em');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('applies a px unit to numeric properties that require it', () => {
    renderer.renderDeclaration('width', 300);
    renderer.renderDeclaration('marginTop', 10);

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('doesnt apply a px unit to numeric properties that dont require it', () => {
    renderer.renderDeclaration('lineHeight', 1.5);
    renderer.renderDeclaration('fontWeight', 600);

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('doesnt apply a px unit to properties that are already prefixed', () => {
    renderer.renderDeclaration('paddingLeft', '10px');
    renderer.renderDeclaration('height', '10vh');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('supports CSS variables within values', () => {
    renderer.renderDeclaration('color', 'var(--primary-color)');
    renderer.renderDeclaration('border', '1px solid var(--border-color)');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('ignores invalid values', () => {
    const className = renderer.render({
      // @ts-ignore
      margin: true,
      // @ts-ignore
      padding: null,
      // @ts-ignore
      color: undefined,
    });

    expect(className).toBe('');
    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  describe('attributes', () => {
    it('generates the correct class names with attribute selector', () => {
      const className = renderer.render({
        background: '#000',
        '[disabled]': {
          backgroundColor: '#286090',
          borderColor: '#204d74',
        },
      });

      expect(className).toBe('1yedsjc 1ezu8qz 1m3gba5');
      expect(renderer.flushedStyles).toMatchSnapshot();
    });

    it('uses same class name between both APIs', () => {
      const classNameA = renderer.render({
        '[disabled]': {
          backgroundColor: '#000',
        },
      });
      const classNameB = renderer.renderDeclaration('backgroundColor', '#000', {
        selector: '[disabled]',
      });

      expect(classNameA).toBe('4u5ry6');
      expect(classNameA).toBe(classNameB);
      expect(renderer.flushedStyles).toMatchSnapshot();
    });

    it('supports complex attribute selectors', () => {
      renderer.renderDeclaration('backgroundColor', '#286090', {
        selector: '[href*="example"]',
      });

      expect(renderer.flushedStyles).toMatchSnapshot();
    });
  });

  describe('pseudos', () => {
    it('generates the correct class names with pseudo selector', () => {
      const className = renderer.render({
        padding: '5px',
        ':hover': {
          padding: 10,
        },
        '::before': {
          content: '"★"',
          display: 'inline-block',
        },
      });

      expect(className).toBe('l1hma1 9yzjcx 1dxv7sg hmvnkb');
      expect(renderer.flushedStyles).toMatchSnapshot();
    });

    it('uses same class name between both APIs', () => {
      const classNameA = renderer.render({
        ':focus': {
          backgroundColor: '#000',
        },
      });
      const classNameB = renderer.renderDeclaration('backgroundColor', '#000', {
        selector: ':focus',
      });

      expect(classNameA).toBe('123nku');
      expect(classNameA).toBe(classNameB);
      expect(renderer.flushedStyles).toMatchSnapshot();
    });

    it('supports complex attribute selectors', () => {
      renderer.renderDeclaration('color', 'white', {
        selector: ':nth-last-of-type(4n)',
      });

      expect(renderer.flushedStyles).toMatchSnapshot();
    });
  });

  describe('hierarchy', () => {
    it('generates the correct class names with hierarchy selector', () => {
      const className = renderer.render({
        padding: 10,
        '+ div': {
          padding: 10,
        },
        '~ SPAN': {
          padding: 10,
        },
        '>li': {
          padding: 10,
        },
        '*': {
          padding: 10,
        },
      });

      expect(className).toBe('2jxlp9 azehd9 vcq0y7 li1ae d8ou53');
      expect(renderer.flushedStyles).toMatchSnapshot();
    });

    it('uses same class name between both APIs', () => {
      const classNameA = renderer.render({
        '+ div': {
          backgroundColor: '#000',
        },
      });
      const classNameB = renderer.renderDeclaration('backgroundColor', '#000', {
        selector: '+ div',
      });

      expect(classNameA).toBe('jclqu0');
      expect(classNameA).toBe(classNameB);
      expect(renderer.flushedStyles).toMatchSnapshot();
    });

    it('supports complex attribute selectors', () => {
      renderer.renderDeclaration('color', 'white', {
        selector: ':first-of-type + li',
      });

      expect(renderer.flushedStyles).toMatchSnapshot();
    });
  });

  describe('at-rules', () => {
    describe('@font-face', () => {
      it('renders and returns family name', () => {
        const name = renderer.renderFontFace({
          fontFamily: 'Open Sans',
          fontStyle: 'normal',
          fontWeight: 800,
          src: 'url("fonts/OpenSans-Bold.woff2")',
        });

        expect(name).toBe('"Open Sans"');
        expect(renderer.flushedStyles).toMatchSnapshot();
      });

      it('quotes each font family name', () => {
        const name = renderer.renderFontFace({
          fontFamily: '"Open Sans", Roboto, Lucida Console',
          fontStyle: 'normal',
          fontWeight: 800,
          src: 'url("fonts/OpenSans-Bold.woff2")',
        });

        expect(name).toBe('"Open Sans", "Roboto", "Lucida Console"');
        expect(renderer.flushedStyles).toMatchSnapshot();
      });
    });

    describe('@import', () => {
      it('renders all variants', () => {
        renderer.renderImport('url("print.css") print');
        renderer.renderImport('url("a11y.css") speech');
        renderer.renderImport("'custom.css'");
        renderer.renderImport('url("chrome://communicator/skin")');
        renderer.renderImport('"common.css" screen;'); // Ends in semicolon
        renderer.renderImport("url('landscape.css') screen and (orientation: landscape)");

        expect(renderer.flushedStyles).toMatchSnapshot();
      });
    });

    describe('@keyframes', () => {
      it('renders from-to based and returns animation name', () => {
        const name = renderer.renderKeyframes({
          from: {
            transform: 'translateX(0%)',
          },
          to: {
            transform: 'translateX(100%)',
          },
        });

        expect(name).toBe('kf103rcyx');
        expect(renderer.flushedStyles).toMatchSnapshot();
      });

      it('renders percentage based and returns animation name', () => {
        const name = renderer.renderKeyframes({
          '0%': { top: 0, left: 0 },
          '30%': { top: 50 },
          '68%, 72%': { left: '50px' },
          '100%': { top: 100, left: '100%' },
        });

        expect(name).toBe('kfnec9co');
        expect(renderer.flushedStyles).toMatchSnapshot();
      });

      it('can provide a custom animation name', () => {
        const name = renderer.renderKeyframes(
          {
            from: {
              transform: 'translateX(0%)',
            },
            to: {
              transform: 'translateX(100%)',
            },
          },
          'slide',
        );

        expect(name).toBe('slide');
        expect(renderer.flushedStyles).toMatchSnapshot();
      });
    });
  });
});
