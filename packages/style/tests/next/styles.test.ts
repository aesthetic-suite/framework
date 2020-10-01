import directionConverter from '@aesthetic/addon-direction';
import vendorPrefixer from '@aesthetic/addon-vendor';
import {
  createTestSheetManager,
  createTestStyleEngine,
  getRenderedStyles,
  purgeStyles,
} from '../../src/testing';
import { StyleEngine, RankCache, SheetManager } from '../../src/types';

const fontFace = {
  fontFamily: '"Open Sans"',
  fontStyle: 'normal',
  fontWeight: 800,
  src: 'url("fonts/OpenSans-Bold.woff2")',
};

describe('Engine', () => {
  let sheetManager: SheetManager;
  let engine: StyleEngine;

  beforeEach(() => {
    sheetManager = createTestSheetManager();
    engine = createTestStyleEngine({
      directionConverter,
      sheetManager,
      vendorPrefixer,
    });
  });

  afterEach(() => {
    purgeStyles();
  });

  it('inserts at-rules before standard rules', () => {
    engine.renderRule({ display: 'block' }, { type: 'global' });
    engine.renderFontFace(fontFace);

    expect(getRenderedStyles('global')).toMatchSnapshot();
  });

  it('inserts imports before at-rules', () => {
    engine.renderFontFace(fontFace);
    engine.renderImport('"custom.css"');

    expect(getRenderedStyles('global')).toMatchSnapshot();
  });

  describe('renderDeclaration()', () => {
    it('generates a unique class name for a large number of properties', () => {
      for (let i = 0; i < 100; i += 1) {
        engine.renderDeclaration('padding', `${i}px`);
      }

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('uses the same class name for the same property value pair', () => {
      engine.renderDeclaration('display', 'block');
      engine.renderDeclaration('display', 'flex');
      engine.renderDeclaration('display', 'block');
      engine.renderDeclaration('display', 'flex');
      engine.renderDeclaration('display', 'inline');
      engine.renderDeclaration('display', 'block');

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('uses the same class name for dashed and camel cased properties', () => {
      engine.renderDeclaration('textDecoration', 'none');
      engine.renderDeclaration('text-decoration', 'none');

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('uses the same class name for numeric and string values', () => {
      engine.renderDeclaration('width', 0);
      engine.renderDeclaration('width', '0');
      engine.renderDeclaration('width', '100em');

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('supports CSS variables', () => {
      engine.renderDeclaration('color', 'var(--primary-color)');
      engine.renderDeclaration('border', '1px solid var(--border-color)');
      engine.renderDeclaration('display', 'var(--display, var(--fallback), flex)');

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('supports fallback values by using an array', () => {
      engine.renderDeclaration('display', ['box', 'block', 'flex']);

      // Wont show in snapshot accurately
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('supports selectors', () => {
      engine.renderDeclaration('color', 'green', { selector: ':hover' });
      engine.renderDeclaration('color', 'red', { selector: '[disabled]' });
      engine.renderDeclaration('color', 'blue', { selector: ':nth-child(2)' });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('supports conditionals', () => {
      engine.renderDeclaration('color', 'green', { conditions: ['@media (max-size: 100px)'] });
      engine.renderDeclaration('color', 'red', { conditions: ['@supports (color: red)'] });
      engine.renderDeclaration('color', 'blue', {
        conditions: [
          '@media (max-width: 100px)',
          '@supports (color: red)',
          '@media (min-width: 200px)',
        ],
      });

      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('supports conditionals with selectors', () => {
      engine.renderDeclaration('color', 'green', {
        conditions: ['@media (max-size: 100px)'],
        selector: ':focus',
      });

      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('converts directional properties', () => {
      engine.renderDeclaration('margin-left', 0);
      engine.renderDeclaration('margin-right', 0);
      engine.renderDeclaration('margin-left', 0, { direction: 'ltr' });
      engine.renderDeclaration('margin-right', 0, { direction: 'rtl' });
      engine.renderDeclaration('margin-left', 0, { direction: 'ltr' });
      engine.renderDeclaration('margin-right', 0, { direction: 'rtl' });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('converts directional values', () => {
      engine.renderDeclaration('text-align', 'left');
      engine.renderDeclaration('text-align', 'right');
      engine.renderDeclaration('text-align', 'left', { direction: 'ltr' });
      engine.renderDeclaration('text-align', 'left', { direction: 'rtl' });
      engine.renderDeclaration('text-align', 'right', { direction: 'ltr' });
      engine.renderDeclaration('text-align', 'right', { direction: 'rtl' });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('prefixes properties, values, value functions, and selectors', () => {
      // Value prefixing (wont show in snapshot because of DOM)
      engine.renderDeclaration('min-width', 'fit-content', { vendor: true });

      // Value function prefixing (wont show in snapshot because of DOM)
      engine.renderDeclaration('background', 'image-set()', { vendor: true });

      // Property prefixing
      engine.renderDeclaration('appearance', 'none', { vendor: true });

      // Selector prefixing
      engine.renderDeclaration('display', 'none', {
        selector: ':fullscreen',
        vendor: true,
      });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('generates a deterministic class name', () => {
      const className = engine.renderDeclaration('margin', 0, { deterministic: true });

      expect(className).toBe('c13kbekr');
    });

    it('generates a ranking (insertion order)', () => {
      const spy = jest.spyOn(sheetManager, 'insertRule');
      const rankings: RankCache = {};

      engine.renderDeclaration('text-align', 'center', { rankings });
      engine.renderDeclaration('text-align', 'center', { rankings });
      engine.renderDeclaration('text-align', 'center', { rankings });

      expect(rankings).toEqual({ 'text-align': 0 });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('inserts the same declaration if the minimum rank is not met (specificity guarantee)', () => {
      const spy = jest.spyOn(sheetManager, 'insertRule');
      const rankings: RankCache = {};

      engine.renderDeclaration('text-align', 'center', { rankings });
      rankings['text-align'] = 1;
      engine.renderDeclaration('text-align', 'center', { rankings });
      rankings['text-align'] = 2;
      engine.renderDeclaration('text-align', 'center', { rankings });

      expect(rankings).toEqual({ 'text-align': 2 });
      expect(spy).toHaveBeenCalledTimes(3);
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('renderFontFace()', () => {
    it('doesnt insert the same at-rule more than once', () => {
      engine.renderFontFace(fontFace);
      engine.renderFontFace(fontFace);

      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('renders and returns family name', () => {
      const name = engine.renderFontFace(fontFace);

      expect(name).toBe('"Open Sans"');
      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('generates a hashed family name if none provided', () => {
      const name = engine.renderFontFace({
        fontStyle: 'normal',
        fontWeight: 800,
        src: 'url("fonts/OpenSans-Bold.woff2")',
      });

      expect(name).toBe('ffweix7s');
      expect(getRenderedStyles('global')).toMatchSnapshot();
    });
  });

  describe('renderImport()', () => {
    it('doesnt insert the same at-rule more than once', () => {
      engine.renderImport("'custom.css'");
      engine.renderImport("'custom.css'");

      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('renders all variants', () => {
      engine.renderImport('url("print.css") print');
      engine.renderImport('url("a11y.css") speech');
      engine.renderImport("'custom.css'");
      engine.renderImport('"common.css" screen');
      engine.renderImport('url("chrome://communicator/skin")');
      engine.renderImport("url('landscape.css') screen and (orientation: landscape)");

      expect(getRenderedStyles('global')).toMatchSnapshot();
    });
  });

  describe('renderKeyframes()', () => {
    it('doesnt insert the same at-rule more than once', () => {
      engine.renderKeyframes({
        from: {
          transform: 'translateX(0%)',
        },
        to: {
          transform: 'translateX(100%)',
        },
      });
      engine.renderKeyframes({
        from: {
          transform: 'translateX(0%)',
        },
        to: {
          transform: 'translateX(100%)',
        },
      });

      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('renders range based and returns animation name', () => {
      const name = engine.renderKeyframes({
        from: {
          transform: 'translateX(0%)',
        },
        to: {
          transform: 'translateX(100%)',
        },
      });

      expect(name).toBe('kf1c8v9l5');
      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('renders percentage based and returns animation name', () => {
      const name = engine.renderKeyframes({
        '0%': { top: 0, left: 0 },
        '30%': { top: '50px' },
        '68%, 72%': { left: '50px' },
        '100%': { top: '100px', left: '100%' },
      });

      expect(name).toBe('kf1a0qg2g');
      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('can provide a custom animation name', () => {
      const name = engine.renderKeyframes(
        {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        'fade',
      );

      expect(name).toBe('fade');
      expect(getRenderedStyles('global')).toMatchSnapshot();
    });

    it('converts between LTR and RTL', () => {
      const ltr = engine.renderKeyframes(
        {
          from: {
            left: '0',
          },
          to: {
            right: '100px',
          },
        },
        '',
        { direction: 'ltr' },
      );

      const rtl = engine.renderKeyframes(
        {
          from: {
            left: '0',
          },
          to: {
            right: '100px',
          },
        },
        '',
        {
          direction: 'rtl',
        },
      );

      expect(ltr).toBe('kf1el0aai');
      expect(rtl).toBe('kf7uqsfu');
      expect(getRenderedStyles('global')).toMatchSnapshot();
    });
  });

  describe('renderRule()', () => {
    it('generates a unique class name for each property', () => {
      const className = engine.renderRule({
        margin: 0,
        padding: '6px 12px',
        border: '1px solid #2e6da4',
        borderRadius: '4px',
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

      expect(className).toBe('a b c d e f g h i j k l m n o p q');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('renderVariable()', () => {
    it('generates a unique class name for a large number of variables', () => {
      for (let i = 0; i < 100; i += 1) {
        engine.renderVariable('fontSize', `${i}px`);
      }

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('uses the same class name for the same property value pair', () => {
      engine.renderVariable('fontSize', '16px');
      engine.renderVariable('fontSize', '16px');
      engine.renderVariable('fontSize', '16px');

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('uses the same class name for dashed and camel cased properties', () => {
      engine.renderVariable('fontSize', '16px');
      engine.renderVariable('font-size', '16px');
      engine.renderVariable('--font-size', '16px');

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('generates a deterministic class name', () => {
      const className = engine.renderVariable('--font-size', '16px', { deterministic: true });

      expect(className).toBe('ca1tahd');
    });
  });
});
