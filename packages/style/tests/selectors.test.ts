import Renderer from '../src/Renderer';
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
});
