import Ruleset from '../src/Ruleset';
import Sheet from '../src/Sheet';
import { Block } from '../src/types';

describe('Ruleset', () => {
  let instance: Ruleset<Block>;
  let sheet: Sheet<Block>;

  beforeEach(() => {
    sheet = new Sheet();
    instance = new Ruleset('test', sheet);
  });

  describe('addNested()', () => {
    it('adds a nested object', () => {
      const obj = sheet.createRuleset('nested').addProperty('color', 'red');

      instance.addNested(':hover', obj);

      expect(instance.nested[':hover']).toEqual(obj);
    });

    it('merges nested objects if selectors are the same', () => {
      const obj1 = sheet
        .createRuleset('nested1')
        .addProperty('color', 'red')
        .addProperty('display', 'block');
      const obj2 = sheet
        .createRuleset('nested2')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      instance.addNested(':hover', obj1);
      instance.addNested(':hover', obj2);

      const obj3 = sheet
        .createRuleset('nested1')
        .addProperty('display', 'block')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      expect(instance.nested[':hover']).toEqual(obj3);
    });

    it('doesnt merge nested objects if flag is false', () => {
      const obj1 = sheet
        .createRuleset('nested1')
        .addProperty('color', 'red')
        .addProperty('display', 'block');
      const obj2 = sheet
        .createRuleset('nested2')
        .addProperty('color', 'blue')
        .addProperty('background', 'white');

      instance.addNested(':hover', obj1);
      instance.addNested(':hover', obj2, false);

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

  describe('createRuleset()', () => {
    it('returns a ruleset', () => {
      expect(instance.createRuleset('test')).toBeInstanceOf(Ruleset);
    });

    it('sets selector, root, and parent', () => {
      const ruleset = instance.createRuleset('test');

      expect(ruleset.selector).toBe('test');
      expect(ruleset.root).toBe(sheet);
      expect(ruleset.parent).toBe(instance);
    });
  });

  describe('merge()', () => {
    it('inherits properties from ruleset', () => {
      instance.addProperty('color', 'red').addProperty('display', 'block');

      const ruleset = sheet
        .createRuleset('nested')
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
      const hover = sheet.createRuleset('hover').addProperty('color', 'black');
      const active = sheet.createRuleset('active').addProperty('color', 'blue');
      const media = sheet.createRuleset('media').addProperty('display', 'block');
      const mediaHover = sheet.createRuleset('media hover').addProperty('display', 'inline');

      // New
      const hover2 = sheet
        .createRuleset('hover')
        .addProperty('color', 'black')
        .addProperty('position', 'relative');
      const media2 = sheet.createRuleset('media').addProperty('display', 'block');
      const mediaHover2 = sheet
        .createRuleset('media hover')
        .addProperty('display', 'inline-flex')
        .addProperty('background', 'transparent');

      instance
        .addNested(':hover', hover)
        .addNested(':active', active)
        .addNested('@media (max-width: 100px)', media);

      media.addNested(':hover', mediaHover);
      media2.addNested(':hover', mediaHover2);

      instance.merge(
        sheet
          .createRuleset('new')
          .addNested(':hover', hover2)
          .addNested('@media (max-width: 100px)', media2),
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
});
