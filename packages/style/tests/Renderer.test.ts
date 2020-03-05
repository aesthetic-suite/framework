import Renderer from '../src/client/ClientRenderer';

describe('Renderer', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  describe('applyUnitToValue()', () => {
    it('does nothing to strings', () => {
      expect(renderer.applyUnitToValue('display', 'foo')).toBe('foo');
      expect(renderer.applyUnitToValue('display', '100px')).toBe('100px');
      expect(renderer.applyUnitToValue('display', 'red')).toBe('red');
    });

    it('does nothing to zeros', () => {
      expect(renderer.applyUnitToValue('width', 0)).toBe('0');
    });

    it('does nothing to unitless properties', () => {
      expect(renderer.applyUnitToValue('lineHeight', 1.5)).toBe('1.5');
    });

    it('does nothing if a unit already exists', () => {
      expect(renderer.applyUnitToValue('width', '100em')).toBe('100em');
      expect(renderer.applyUnitToValue('height', '10vh')).toBe('10vh');
    });

    it('appends px to numbers', () => {
      expect(renderer.applyUnitToValue('width', 100)).toBe('100px');
    });

    it('can customize unit', () => {
      renderer.options.unit = 'em';

      expect(renderer.applyUnitToValue('width', 100)).toBe('100em');
    });
  });
});
