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
});
