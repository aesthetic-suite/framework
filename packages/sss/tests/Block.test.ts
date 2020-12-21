import Block from '../src/Block';
import { Properties } from '../src/types';
import { createBlock } from './helpers';

describe('Block', () => {
  let instance: Block<Properties>;

  beforeEach(() => {
    instance = new Block('test');
  });

  describe('addClassName()', () => {
    it('adds a class name to the current block if no parent', () => {
      instance.addClassName('foo');

      expect(instance.className).toBe(' foo');
    });

    it('adds a class name to the root parent', () => {
      const child = createBlock('');
      const grandchild = createBlock(':hover');

      instance.addNested(child);
      child.addNested(grandchild);

      grandchild.addClassName('foo');

      expect(instance.className).toBe(' foo');
      expect(grandchild.className).toBe('');
    });
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
      obj3.parent = instance;

      expect(instance.nested[':hover']).toEqual(obj3);
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

  describe('getSelectors()', () => {
    it('returns current selector if defined', () => {
      expect(instance.getSelectors()).toEqual(['test']);
    });

    it('returns an empty array if not defined', () => {
      instance = createBlock('');

      expect(instance.getSelectors()).toEqual([]);
    });

    it('returns a list of all ancestry selectors, skipping over empty ones', () => {
      const child = createBlock('');
      const grandchild = createBlock(':hover');

      instance.addNested(child);
      child.addNested(grandchild);

      grandchild.addClassName('foo');

      expect(instance.getSelectors()).toEqual(['test']);
      expect(grandchild.getSelectors()).toEqual(['test', ':hover']);
    });
  });

  describe('merge()', () => {
    it('inherits properties from rule', () => {
      instance.addProperty('color', 'red').addProperty('display', 'block');

      const rule = createBlock('nested')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      instance.merge(rule);

      expect(instance.toObject()).toEqual({
        color: 'blue',
        display: 'block',
        background: 'white',
      });
    });

    it('inherits nested from rule', () => {
      // Base
      const hover = createBlock(':hover').addProperty('color', 'black');
      const active = createBlock(':active').addProperty('color', 'blue');
      const media = createBlock('@media (max-width: 100px)').addProperty('display', 'block');
      const mediaHover = createBlock(':hover').addProperty('display', 'inline');

      // New
      const hover2 = createBlock(':hover')
        .addProperty('color', 'black')
        .addProperty('position', 'relative');
      const media2 = createBlock('@media (max-width: 100px)');
      const mediaHover2 = createBlock(':hover')
        .addProperty('display', 'inline-flex')
        .addProperty('background', 'transparent');

      instance.addNested(hover);
      instance.addNested(active);
      instance.addNested(media);

      media.addNested(mediaHover);
      media2.addNested(mediaHover2);

      const next = createBlock('new');
      next.addNested(hover2);
      next.addNested(media2);

      instance.merge(next);

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
