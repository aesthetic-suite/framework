import Renderer from '../src/client/ClientRenderer';
import { getRenderedStyles, purgeStyles } from '../src/testing';

describe('Specificity', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  afterEach(() => {
    purgeStyles();
  });

  it('inserts declarations in the order they are defined', () => {
    renderer.renderRule({
      margin: 0,
      padding: '1px',
      width: '50px',
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts declarations in the order they are defined (reversed)', () => {
    renderer.renderRule({
      width: '50px',
      padding: '1px',
      margin: 0,
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts selectors in the order they are defined', () => {
    renderer.renderRule({
      color: 'white',
      ':active': {
        color: 'red',
      },
      ':hover': {
        color: 'blue',
      },
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts selectors in the order they are defined (reversed)', () => {
    renderer.renderRule({
      color: 'white',
      ':hover': {
        color: 'blue',
      },
      ':active': {
        color: 'red',
      },
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  describe('ordered rules', () => {
    const rule = {
      button: {
        padding: '8px',
        display: 'inline-block',
        color: 'red',

        ':hover': {
          color: 'darkred',
        },
      },
      buttonActive: {
        color: 'darkred',
      },
      buttonDisabled: {
        color: 'gray',
      },
    };

    it('renders in defined order if no explicit order provided', () => {
      const className = renderer.renderRulesOrdered(rule);

      expect(className).toBe('a b c d e f');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('renders in a explicit order', () => {
      const className = renderer.renderRulesOrdered(rule, [
        'buttonActive',
        'buttonDisabled',
        'button',
      ]);

      expect(className).toBe('a b c d e f');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('renders the same class names from previous render', () => {
      const classNameA = renderer.renderRulesOrdered(rule, ['buttonActive']);
      const classNameB = renderer.renderRulesOrdered(rule, ['buttonActive']);

      expect(classNameA).toBe('a');
      expect(classNameA).toBe(classNameB);
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('can omit sets', () => {
      const className = renderer.renderRulesOrdered(rule, ['buttonActive']);

      expect(className).toBe('a');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });

    it('can render set by set', () => {
      const a = renderer.renderRulesOrdered(rule, ['buttonActive']);

      expect(a).toBe('a');
      expect(getRenderedStyles('standard')).toMatchSnapshot();

      const b = renderer.renderRulesOrdered(rule, ['button']);

      expect(b).toBe('b c d e');
      expect(getRenderedStyles('standard')).toMatchSnapshot();

      const c = renderer.renderRulesOrdered(rule, ['buttonDisabled']);

      expect(c).toBe('f');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
    });
  });
});
