import directionConverter from '@aesthetic/addon-direction';
import vendorPrefixer from '@aesthetic/addon-vendor';
import { createTestStyleEngine, getRenderedStyles, purgeStyles } from '../../src/testing';
import { Engine } from '../../src/types';

describe('Engine', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = createTestStyleEngine({
      directionConverter,
      vendorPrefixer,
    });
  });

  afterEach(() => {
    purgeStyles();
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

    it('supports conditionals using strings', () => {
      engine.renderDeclaration('color', 'green', {
        conditions: '@media (max-size: 100px) { #rule# }',
      });
      engine.renderDeclaration('color', 'red', { conditions: '@supports (color: red) { #rule# }' });
      engine.renderDeclaration('color', 'blue', {
        conditions:
          '@media (max-width: 100px) { @supports (color: red) { @media (min-width: 200px) { #rule# } } }',
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
  });
});
