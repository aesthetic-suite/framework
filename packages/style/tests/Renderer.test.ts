import Renderer from '../src/Renderer';
import getDocumentStyleSheet from '../src/getDocumentStyleSheet';
import getInsertedStyles from '../src/getInsertedStyles';
import { SheetType } from '../src/types';

function purgeStyles(type: SheetType) {
  const sheet = getDocumentStyleSheet(type);

  for (let i = 0; i < sheet.cssRules.length; i += 1) {
    sheet.deleteRule(0);
  }
}

describe('Renderer', () => {
  let renderer: Renderer;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    renderer = new Renderer();

    // Avoid warnings
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();

    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  });

  it('generates a unique class name for each property', () => {
    const className = renderer.renderRule({
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
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('generates a unique class name for each selector even if property value pair is the same', () => {
    const className = renderer.renderRule({
      background: '#000',
      ':hover': {
        background: '#000',
      },
      '[disabled]': {
        background: '#000',
      },
    });

    expect(className).toBe('1yedsjc yb3jac ooy7ta');
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for the same property value pair', () => {
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'inline');
    renderer.renderDeclaration('display', 'block');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for dashed and camel cased properties', () => {
    renderer.renderDeclaration('textDecoration', 'none');
    renderer.renderDeclaration('text-decoration', 'none');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for numeric and string values', () => {
    renderer.renderDeclaration('width', 100);
    renderer.renderDeclaration('width', '100px');
    renderer.renderDeclaration('width', '100em');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('applies a px unit to numeric properties that require it', () => {
    renderer.renderDeclaration('width', 300);
    renderer.renderDeclaration('marginTop', 10);

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('doesnt apply a px unit to numeric properties that dont require it', () => {
    renderer.renderDeclaration('lineHeight', 1.5);
    renderer.renderDeclaration('fontWeight', 600);

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('doesnt apply a px unit to properties that are already prefixed', () => {
    renderer.renderDeclaration('paddingLeft', '10px');
    renderer.renderDeclaration('height', '10vh');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('supports CSS variables within values', () => {
    renderer.renderDeclaration('color', 'var(--primary-color)');
    renderer.renderDeclaration('border', '1px solid var(--border-color)');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('can nest conditionals infinitely', () => {
    renderer.renderRule({
      margin: 0,
      '@media (width: 500px)': {
        margin: 10,
        ':hover': {
          color: 'red',
        },
        '@media (width: 350px)': {
          '@supports (color: blue)': {
            color: 'blue',
          },
        },
      },
    });

    expect(getInsertedStyles('standard')).toMatchSnapshot();
    expect(getInsertedStyles('conditions')).toMatchSnapshot();
  });

  it('ignores invalid values', () => {
    const className = renderer.renderRule({
      // @ts-ignore
      margin: true,
      // @ts-ignore
      padding: null,
      // @ts-ignore
      color: undefined,
    });

    expect(className).toBe('');
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  describe('media queries', () => {
    it('supports @media conditions', () => {
      const className = renderer.renderRule({
        background: '#000',
        padding: 15,
        '@media (max-width: 600px)': {
          padding: 15,
        },
        '@media screen and (min-width: 900px)': {
          padding: 20,
        },
      });

      expect(className).toBe('1yedsjc q1v28o 1l0h3j6 1d6vyr6');
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });

    it('can be nested in @supports', () => {
      const className = renderer.renderRule({
        padding: 15,
        '@supports (display: flex)': {
          '@media (max-width: 600px)': {
            padding: 15,
          },
        },
      });

      expect(className).toBe('q1v28o 1nadnnc');
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });
  });

  describe('supports', () => {
    it('supports @supports conditions', () => {
      const className = renderer.renderRule({
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
      });

      expect(className).toBe('1s7hmty ku62hq');
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });

    it('can be nested in @media', () => {
      const className = renderer.renderRule({
        display: 'block',
        '@media screen and (min-width: 900px)': {
          '@supports (display: flex)': {
            display: 'flex',
          },
        },
      });

      expect(className).toBe('1s7hmty xu0c72');
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });
  });

  describe('attributes', () => {
    it('generates the correct class names with attribute selector', () => {
      const className = renderer.renderRule({
        background: '#000',
        '[disabled]': {
          backgroundColor: '#286090',
          borderColor: '#204d74',
        },
      });

      expect(className).toBe('1yedsjc 1ezu8qz 1m3gba5');
      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });

    it('uses same class name between both APIs', () => {
      const classNameA = renderer.renderRule({
        '[disabled]': {
          backgroundColor: '#000',
        },
      });
      const classNameB = renderer.renderDeclaration('backgroundColor', '#000', {
        selector: '[disabled]',
      });

      expect(classNameA).toBe('4u5ry6');
      expect(classNameA).toBe(classNameB);
      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });

    it('supports complex attribute selectors', () => {
      renderer.renderDeclaration('backgroundColor', '#286090', {
        selector: '[href*="example"]',
      });

      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('pseudos', () => {
    it('generates the correct class names with pseudo selector', () => {
      const className = renderer.renderRule({
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
      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });

    it('uses same class name between both APIs', () => {
      const classNameA = renderer.renderRule({
        ':focus': {
          backgroundColor: '#000',
        },
      });
      const classNameB = renderer.renderDeclaration('backgroundColor', '#000', {
        selector: ':focus',
      });

      expect(classNameA).toBe('123nku');
      expect(classNameA).toBe(classNameB);
      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });

    it('supports complex attribute selectors', () => {
      renderer.renderDeclaration('color', 'white', {
        selector: ':nth-last-of-type(4n)',
      });

      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('hierarchy', () => {
    it('generates the correct class names with hierarchy selector', () => {
      const className = renderer.renderRule({
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
      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });

    it('uses same class name between both APIs', () => {
      const classNameA = renderer.renderRule({
        '+ div': {
          backgroundColor: '#000',
        },
      });
      const classNameB = renderer.renderDeclaration('backgroundColor', '#000', {
        selector: '+ div',
      });

      expect(classNameA).toBe('jclqu0');
      expect(classNameA).toBe(classNameB);
      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });

    it('supports complex attribute selectors', () => {
      renderer.renderDeclaration('color', 'white', {
        selector: ':first-of-type + li',
      });

      expect(getInsertedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('at-rules', () => {
    describe('@font-face', () => {
      it('renders and returns family name', () => {
        const name = renderer.renderFontFace({
          fontFamily: '"Open Sans"',
          fontStyle: 'normal',
          fontWeight: 800,
          src: 'url("fonts/OpenSans-Bold.woff2")',
        });

        expect(name).toBe('"Open Sans"');
        expect(getInsertedStyles('global')).toMatchSnapshot();
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

        expect(getInsertedStyles('global')).toMatchSnapshot();
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
        expect(getInsertedStyles('global')).toMatchSnapshot();
      });

      it('renders percentage based and returns animation name', () => {
        const name = renderer.renderKeyframes({
          '0%': { top: 0, left: 0 },
          '30%': { top: 50 },
          '68%, 72%': { left: '50px' },
          '100%': { top: 100, left: '100%' },
        });

        expect(name).toBe('kfnec9co');
        expect(getInsertedStyles('global')).toMatchSnapshot();
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
        expect(getInsertedStyles('global')).toMatchSnapshot();
      });
    });
  });
});
