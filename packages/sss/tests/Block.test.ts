import Block from '../src/Block';
import { Properties } from '../src/types';
import { createBlock } from './helpers';

describe('Block', () => {
  let instance: Block<Properties>;

  beforeEach(() => {
    instance = new Block('test');
  });

  describe('addNested()', () => {
    it('adds a nested object', () => {
      const obj = createBlock(':hover').addProperty('color', 'red');

      instance.addNested(obj);

      expect(instance.nested[':hover']).toEqual(obj);
    });

    it('merges nested objects if selectors are the same', () => {
      const obj1 = createBlock(':hover')
        .addProperty('color', 'red')
        .addProperty('display', 'block');
      const obj2 = createBlock(':hover')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      instance.addNested(obj1);
      instance.addNested(obj2);

      const obj3 = createBlock(':hover')
        .addProperty('display', 'block')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      expect(instance.nested[':hover']).toEqual(obj3);
    });

    it('doesnt merge nested objects if flag is false', () => {
      const obj1 = createBlock(':hover')
        .addProperty('color', 'red')
        .addProperty('display', 'block');
      const obj2 = createBlock(':hover')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      instance.addNested(obj1);
      instance.addNested(obj2, false);

      expect(instance.nested[':hover']).toEqual(obj2);
    });
  });

  describe('addProperty()', () => {
    it('sets a property', () => {
      instance.addProperty('color', 'red');

      expect(instance.properties.color).toBe('red');
    });

    it('overwrites a property of the same name', () => {
      instance.addProperty('color', 'red');
      instance.addProperty('color', 'blue');

      expect(instance.properties.color).toBe('blue');
    });
  });

  describe('addProperties()', () => {
    it('sets multiple properties', () => {
      instance.addProperties({
        color: 'red',
        display: 'block',
      });

      expect(instance.properties).toEqual({
        color: 'red',
        display: 'block',
      });
    });
  });

  describe('addVariable()', () => {
    it('sets a variable', () => {
      instance.addVariable('--color', 'red');

      expect(instance.variables['--color']).toBe('red');
    });

    it('overwrites a variable of the same name', () => {
      instance.addVariable('--color', 'red');
      instance.addVariable('--color', 'blue');

      expect(instance.variables['--color']).toBe('blue');
    });
  });

  describe('merge()', () => {
    it('inherits properties from ruleset', () => {
      instance.addProperty('color', 'red').addProperty('display', 'block');

      const ruleset = createBlock('nested')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      instance.merge(ruleset);

      expect(instance.toObject()).toEqual({
        color: 'blue',
        display: 'block',
        background: 'white',
      });
    });

    it('inherits nested from ruleset', () => {
      // Base
      const hover = createBlock(':hover').addProperty('color', 'black');
      const active = createBlock(':active').addProperty('color', 'blue');
      const media = createBlock('@media (max-width: 100px)').addProperty('display', 'block');
      const mediaHover = createBlock(':hover').addProperty('display', 'inline');

      // New
      const hover2 = createBlock(':hover')
        .addProperty('color', 'black')
        .addProperty('position', 'relative');
      const media2 = createBlock('@media (max-width: 100px)').addProperty('display', 'block');
      const mediaHover2 = createBlock(':hover')
        .addProperty('display', 'inline-flex')
        .addProperty('background', 'transparent');

      instance
        .addNested(hover)
        .addNested(active)
        .addNested(media);

      media.addNested(mediaHover);
      media2.addNested(mediaHover2);

      instance.merge(
        createBlock('new')
          .addNested(hover2)
          .addNested(media2),
      );

      expect(instance.toObject()).toEqual({
        ':hover': {
          color: 'black',
          position: 'relative',
        },
        ':active': {
          color: 'blue',
        },
        '@media (max-width: 100px)': {
          display: 'block',

          ':hover': {
            display: 'inline-flex',
            background: 'transparent',
          },
        },
      });
    });
  });

  describe('toObject()', () => {
    it('returns a plain object', () => {
      instance
        .addProperty('color', 'red')
        .addProperty('display', 'block')
        .addVariable('--font-size', '14px');

      expect(instance.toObject()).toEqual({
        '--font-size': '14px',
        color: 'red',
        display: 'block',
      });
    });
  });
});
