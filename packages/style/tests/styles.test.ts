import Renderer from '../src/client/ClientRenderer';
import { getRenderedStyles, purgeStyles } from '../src/testing';
import { MEDIA_RULE } from '../src/constants';

describe('Styles', () => {
  let renderer: Renderer;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    renderer = new Renderer();

    // Avoid warnings
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();

    purgeStyles();
  });

  it('generates a unique class name for a large number of properties', () => {
    for (let i = 0; i < 100; i += 1) {
      renderer.renderDeclaration('padding', `${i}px`);
    }

    expect(getRenderedStyles('standard')).toMatchSnapshot();
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

  it('uses the same class name for the same property value pair', () => {
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'inline');
    renderer.renderDeclaration('display', 'block');

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for dashed and camel cased properties', () => {
    renderer.renderDeclaration('textDecoration', 'none');
    renderer.renderDeclaration('text-decoration', 'none');

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for numeric and string values', () => {
    renderer.renderDeclaration('width', 0);
    renderer.renderDeclaration('width', '0');
    renderer.renderDeclaration('width', '100em');

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('generates different class names between standard and condition rules, when condition is inserted first', () => {
    const a = renderer.renderDeclaration('width', '100em', {
      conditions: [{ query: '(max-width: 100px)', type: MEDIA_RULE }],
    });
    const b = renderer.renderDeclaration('width', '100em');

    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(a).not.toBe(b);
  });

  it('supports CSS variables within values', () => {
    renderer.renderDeclaration('color', 'var(--primary-color)');
    renderer.renderDeclaration('border', '1px solid var(--border-color)');
    renderer.renderDeclaration('display', 'var(--display, var(--fallback), flex)');

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('can set CSS variables', () => {
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

  it('generates the same declaration for each type (non-standard)', () => {
    const a = renderer.renderDeclaration('color', 'red', { type: 'global' });
    const b = renderer.renderDeclaration('color', 'red', { type: 'standard' });

    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(a).not.toBe(b);
    expect(getRenderedStyles('global')).toMatchSnapshot();
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('generates different declarations when RTL converting', () => {
    const a = renderer.renderDeclaration('margin-left', '10px');
    const b = renderer.renderDeclaration('margin-left', '10px', { rtl: true });

    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(a).not.toBe(b);
    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('applies vendor prefixes to a property under a single class name', () => {
    // Value prefixing (wont show in snapshot because of DOM)
    renderer.renderDeclaration('min-width', 'fit-content', { prefix: true });

    // Value function prefixing (wont show in snapshot because of DOM)
    renderer.renderDeclaration('background', 'image-set()', { prefix: true });

    // Property prefixing
    renderer.renderDeclaration('appearance', 'none', { prefix: true });

    // Selector prefixing
    renderer.renderDeclaration('display', 'none', { selector: ':fullscreen', prefix: true });

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
        prefix: true,
        rtl: false,
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
        prefix: true,
        rtl: true,
      },
    );

    expect(a).toBe('cu4ygwf c8nj8ar c1u1u927 c16p9s9v');
    expect(b).toBe('cu4ygwf c1ryula0 cfi87yc c16p9s9v');
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

      expect(className).toBe('a');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can utilize deterministic class names', () => {
      const className = renderer.renderRuleGrouped(rule, { deterministic: true });

      expect(className).toBe('c19x5a9t');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can vendor prefix applicable properties', () => {
      const className = renderer.renderRuleGrouped(rule, { prefix: true });

      expect(className).toBe('a');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can RTL convert applicable properties', () => {
      const className = renderer.renderRuleGrouped(rule, { rtl: true });

      expect(className).toBe('a');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
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

      expect(className).toBe('a');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('warns about variables when using a non-grouped rule', () => {
      const className = renderer.renderRule(rule);

      expect(className).toBe('a b');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith(
        'CSS variables are only accepted within rule groups. Found "--color" variable.',
      );
    });
  });
});
