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

      instance.nest(child);
      child.nest(grandchild);

      grandchild.addClassName('foo');

      expect(instance.className).toBe(' foo');
      expect(grandchild.className).toBe('');
    });
  });

  describe('nest()', () => {
    it('adds a nested object', () => {
      const obj = createBlock(':hover');
      obj.properties.color = 'red';

      instance.nest(obj);

      expect(instance.nested[':hover']).toEqual(obj);
    });

    it('merges nested objects if selectors are the same', () => {
      const obj1 = createBlock(':hover');
      obj1.properties.color = 'red';
      obj1.properties.display = 'block';

      const obj2 = createBlock(':hover');
      obj2.properties.color = 'blue';
      obj2.properties.background = 'white';

      instance.nest(obj1);
      instance.nest(obj2);

      const obj3 = createBlock(':hover');
      obj3.properties.color = 'blue';
      obj3.properties.display = 'block';
      obj3.properties.background = 'white';
      obj3.parent = instance;

      expect(instance.nested[':hover']).toEqual(obj3);
    });
  });

  describe('merge()', () => {
    it('inherits properties from rule', () => {
      instance.properties.color = 'red';
      instance.properties.display = 'block';

      const rule = createBlock('nested');
      rule.properties.color = 'blue';
      rule.properties.background = 'white';

      instance.merge(rule);

      expect(instance.toObject()).toEqual({
        color: 'blue',
        display: 'block',
        background: 'white',
      });
    });

    it('inherits nested from rule', () => {
      // Base
      const hover = createBlock(':hover');
      hover.properties.color = 'black';

      const active = createBlock(':active');
      active.properties.color = 'blue';

      const media = createBlock('@media (max-width: 100px)');
      media.properties.display = 'block';

      const mediaHover = createBlock(':hover');
      mediaHover.properties.display = 'inline';

      // New
      const hover2 = createBlock(':hover');
      hover2.properties.color = 'black';
      hover2.properties.position = 'relative';

      const media2 = createBlock('@media (max-width: 100px)');
      const mediaHover2 = createBlock(':hover');
      mediaHover2.properties.display = 'inline-flex';
      mediaHover2.properties.background = 'transparent';

      instance.nest(hover);
      instance.nest(active);
      instance.nest(media);

      media.nest(mediaHover);
      media2.nest(mediaHover2);

      const next = createBlock('new');
      next.nest(hover2);
      next.nest(media2);

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
      instance.properties.color = 'red';
      instance.properties.display = 'block';
      instance.variables['--font-size'] = '14px';

      expect(instance.toObject()).toEqual({
        '--font-size': '14px',
        color: 'red',
        display: 'block',
      });
    });
  });
});
