import Renderer from '../src/client/ClientRenderer';
import getInsertedStyles from '../src/helpers/getInsertedStyles';
import purgeStyles from './purgeStyles';

describe('Selectors', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  afterEach(() => {
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
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

      expect(className).toBe('a b c');
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

      expect(classNameA).toBe('a');
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
          padding: '10px',
        },
        '::before': {
          content: '"★"',
          display: 'inline-block',
        },
      });

      expect(className).toBe('a b c d');
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

      expect(classNameA).toBe('a');
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
        padding: '10px',
        '+ div': {
          padding: '10px',
        },
        '~ SPAN': {
          padding: '10px',
        },
        '>li': {
          padding: '10px',
        },
        '*': {
          padding: '10px',
        },
      });

      expect(className).toBe('a b c d e');
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

      expect(classNameA).toBe('a');
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
});
