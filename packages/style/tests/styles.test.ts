import converter from '@aesthetic/addon-direction';
import prefixer from '@aesthetic/addon-vendor';
import Renderer from '../src/client/ClientRenderer';
import { getRenderedStyles, purgeStyles } from '../src/testing';

describe('Styles', () => {
  let renderer: Renderer;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    renderer = new Renderer({
      converter,
      prefixer,
    });

    // Avoid warnings
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();

    purgeStyles();
  });

  it('generates a unique class name for each property', () => {
    const className = renderer.renderRule({
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

  it('generates a deterministic class name for each property', () => {
    const className = renderer.renderRule(
      {
        margin: 0,
        cursor: 'pointer',
      },
      { deterministic: true },
    );
    const cursor = renderer.renderDeclaration('cursor', 'pointer', { deterministic: true });

    expect(className).toBe('c1cpw2zw c1jzt5o3');
    expect(className).toContain(cursor);
    expect(cursor).toBe('c1jzt5o3');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
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

    expect(className).toBe('a b c');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('generates different class names between standard and condition rules, when condition is inserted first', () => {
    const a = renderer.renderDeclaration('width', '100em', {
      conditions: ['@media (max-width: 100px)'],
    });
    const b = renderer.renderDeclaration('width', '100em');

    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(a).not.toBe(b);
  });

  it('supports rendering a single CSS variable', () => {
    const className = renderer.renderVariable('--primary-color', 'black');

    expect(className).toBe('a');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('can apply CSS variables to the root', () => {
    renderer.applyRootVariables({
      someVar: '10px',
      '--already-formatted-var': '10em',
      'missing-prefix': '10px',
      mixOfBoth: '10px',
    });

    const root = document.documentElement;

    expect(root.style.getPropertyValue('--some-var')).toBe('10px');
    expect(root.style.getPropertyValue('--already-formatted-var')).toBe('10em');
    expect(root.style.getPropertyValue('--missing-prefix')).toBe('10px');
    expect(root.style.getPropertyValue('--mix-of-both')).toBe('10px');
  });

  it('can nest conditionals infinitely', () => {
    renderer.renderRule({
      margin: 0,
      '@media (width: 500px)': {
        margin: '10px',
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

    expect(getRenderedStyles('standard')).toMatchSnapshot();
    expect(getRenderedStyles('conditions')).toMatchSnapshot();
  });

  it('ignores invalid values', () => {
    const className = renderer.renderRule({
      // @ts-expect-error
      margin: true,
      // @ts-expect-error
      padding: null,
      color: undefined,
    });

    expect(className).toBe('');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts into the appropriate style sheets', () => {
    renderer.renderRule({
      background: 'white',
      '@media (prefers-color-scheme: dark)': {
        background: 'black',
      },
    });

    renderer.renderImport('url(test.css)');

    expect(getRenderedStyles('global')).toMatchSnapshot();
    expect(getRenderedStyles('standard')).toMatchSnapshot();
    expect(getRenderedStyles('conditions')).toMatchSnapshot();
  });

  it('logs a warning for unknown property values', () => {
    renderer.renderRule({
      // @ts-expect-error
      color: true,
    });

    expect(spy).toHaveBeenCalledWith('Invalid value "true" for property "color".');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('logs a warning for unknown nested selector', () => {
    renderer.renderRule({
      background: 'white',
      '$ what is this': {
        background: 'black',
      },
    });

    expect(spy).toHaveBeenCalledWith('Unknown property selector or nested block "$ what is this".');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('can insert the same declaration if using a minimum rank requirement', () => {
    renderer.renderDeclaration('color', 'red'); // 0
    renderer.renderDeclaration('color', 'green'); // 1

    const c = renderer.renderDeclaration('color', 'blue'); // 2
    const d = renderer.renderDeclaration('color', 'blue', { rankings: { color: 10 } }); // 3

    expect(c).toBe('c');
    expect(d).toBe('d');
    expect(c).not.toBe(d);
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('can insert the same declaration if using a shared rankings cache', () => {
    const rankings = {};

    renderer.renderRule({ color: 'red', display: 'inline' }, { rankings });
    renderer.renderRule({ color: 'blue' }, { rankings });
    renderer.renderRule({ color: 'green', display: 'block' }, { rankings });

    // Should render again
    renderer.renderRule({ color: 'red', display: 'inline' }, { rankings });

    expect(rankings).toEqual({ color: 5, display: 6 });
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('wont insert the same declaration if not using a shared rankings cache', () => {
    renderer.renderRule({ color: 'red', display: 'inline' });
    renderer.renderRule({ color: 'blue' });
    renderer.renderRule({ color: 'green', display: 'block' });

    // Should NOT render again
    renderer.renderRule({ color: 'red', display: 'inline' });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('generates different declarations when RTL converting', () => {
    const a = renderer.renderDeclaration('margin-left', '10px');
    const b = renderer.renderDeclaration('margin-left', '10px', { direction: 'rtl' });

    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(a).not.toBe(b);
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('handles right-to-left, vendor prefixes, and deterministic classes all at once', () => {
    const a = renderer.renderRule(
      {
        display: 'flex',
        marginLeft: '10px',
        textAlign: 'right',
        appearance: 'none',
      },
      {
        deterministic: true,
        direction: 'ltr',
        vendor: true,
      },
    );

    // RTL
    const b = renderer.renderRule(
      {
        display: 'flex',
        marginLeft: '10px',
        textAlign: 'right',
        appearance: 'none',
      },
      {
        deterministic: true,
        direction: 'rtl',
        vendor: true,
      },
    );

    expect(a).toBe('cu4ygwf c8nj8ar c1u1u927 c1qa0d3c');
    expect(b).toBe('cu4ygwf c1ryula0 cfi87yc c1qa0d3c');
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  describe('rule grouping', () => {
    const rule = {
      display: 'block',
      background: 'transparent',
      color: 'black',
      paddingRight: 0,
      marginLeft: 0,
      transition: '200ms all',
      appearance: 'none',
      ':hover': {
        display: 'flex',
        color: 'blue',
      },
      '::backdrop': {
        background: 'black',
      },
      '@media (width: 500px)': {
        margin: '10px',
        padding: '10px',
        ':hover': {
          color: 'darkblue',
        },
      },
    } as const;

    it('can generate a non-atomic single class by grouping all properties', () => {
      const className = renderer.renderRuleGrouped(rule);

      expect(className).toBe('c19x5a9t');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('generates a consistent class name for same properties', () => {
      const a = renderer.renderRuleGrouped(rule);
      const b = renderer.renderRuleGrouped(rule);

      expect(a).toBe(b);
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can vendor prefix applicable properties', () => {
      const className = renderer.renderRuleGrouped(rule, { vendor: true });

      expect(className).toBe('c1winuf3');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can RTL convert applicable properties', () => {
      const className = renderer.renderRuleGrouped(rule, { direction: 'rtl' });

      expect(className).toBe('c12ol95t');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('handles right-to-left, vendor prefixes, and deterministic classes all at once', () => {
      const a = renderer.renderRuleGrouped(rule, {
        deterministic: true,
        direction: 'ltr',
        vendor: true,
      });

      // RTL
      const b = renderer.renderRuleGrouped(rule, {
        deterministic: true,
        direction: 'rtl',
        vendor: true,
      });

      expect(a).toBe('c1winuf3');
      expect(b).toBe('cbk8r6n');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('css variables', () => {
    const rule = {
      display: 'block',
      color: 'var(--color)',
      '--color': 'red',
      '--font-size': '14px',
    };

    it('includes variables in rule when using a rule group', () => {
      const className = renderer.renderRuleGrouped(rule);

      expect(className).toBe('cakyybw');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('generates separate classes when not using a group', () => {
      const className = renderer.renderRule(rule);

      expect(className).toBe('a b c d');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });
  });

  describe('unit suffixes', () => {
    it('adds suffix to number values', () => {
      renderer.renderRule({
        marginLeft: '10px',
        marginRight: 20,
      });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('doesnt suffix 0 values', () => {
      renderer.renderRule({
        margin: 0,
      });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('doesnt suffix unitless values', () => {
      renderer.renderRule({
        lineHeight: 1.25,
      });

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('can customize with a string `unit` option', () => {
      renderer.renderRule(
        {
          marginLeft: '10px',
          marginRight: 20,
        },
        {
          unit: 'rem',
        },
      );

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('can customize with a function `unit` option', () => {
      renderer.renderRule(
        {
          margin: 10,
          padding: 20,
          fontSize: 16,
          width: 100,
        },
        {
          unit(prop) {
            /* eslint-disable jest/no-if */
            if (prop.includes('margin')) return '%';
            if (prop.includes('padding')) return 'rem';
            if (prop === 'font-size') return 'pt';

            return 'px';
          },
        },
      );

      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });
  });
});
