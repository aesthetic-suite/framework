import Ruleset from '../src/Ruleset';
import Sheet from '../src/Sheet';
import { Block } from '../src/types';

describe('Sheet', () => {
  let sheet: Sheet<Block>;

  beforeEach(() => {
    sheet = new Sheet();
  });

  describe('constructor()', () => {
    it('passes options', () => {
      sheet = new Sheet({ rtl: true });

      expect(sheet.options).toEqual({ rtl: true });
    });
  });

  describe('addAtRule()', () => {
    it('adds a rule', () => {
      expect(sheet.atRules['@import']).toBeUndefined();

      sheet.addAtRule('@import', './foo');

      expect(sheet.atRules['@import']).toBe('./foo');
    });
  });

  describe('addClassName()', () => {
    it('adds a class name', () => {
      expect(sheet.classNames.foo).toBeUndefined();

      sheet.addClassName('foo', 'foo');

      expect(sheet.classNames.foo).toBe('foo');
    });
  });

  describe('addRuleset()', () => {
    it('adds a rule set', () => {
      expect(sheet.ruleSets.foo).toBeUndefined();

      const ruleset = new Ruleset('foo', sheet);
      sheet.addRuleset(ruleset);

      expect(sheet.ruleSets.foo).toBe(ruleset);
    });
  });

  describe('createRuleset()', () => {
    it('creates and returns a ruleset', () => {
      const ruleset = sheet.createRuleset('bar');

      expect(ruleset).toBeInstanceOf(Ruleset);
      expect(ruleset.selector).toBe('bar');
      expect(ruleset.root).toBe(sheet);
    });
  });

  describe('createSheet()', () => {
    it('creates and returns a sheet', () => {
      const newSheet = sheet.createSheet();

      expect(newSheet).toBeInstanceOf(Sheet);
    });

    it('can override inherited options', () => {
      sheet.options.rtl = true;

      const newSheet = sheet.createSheet({ rtl: false });

      expect(newSheet.options).toEqual({ rtl: false });
    });
  });

  describe('toObject()', () => {
    describe('at-rules', () => {
      it('returns a string', () => {
        sheet.addAtRule('@import', './foo.css');

        expect(sheet.toObject()).toEqual({
          '@import': './foo.css',
        });
      });

      it('returns an array of strings', () => {
        sheet.addAtRule('@import', ['./foo.css', './bar.css']);

        expect(sheet.toObject()).toEqual({
          '@import': ['./foo.css', './bar.css'],
        });
      });

      it('returns a ruleset', () => {
        const ruleset = sheet.createRuleset('foo').addProperty('margin', '1cm');

        sheet.addAtRule('@page', ruleset);

        expect(sheet.toObject()).toEqual({
          '@page': { margin: '1cm' },
        });
      });

      it('returns an array of rulesets', () => {
        const ff1 = sheet.createRuleset('Roboto').addProperty('fontWeight', 'bold');
        const ff2 = sheet.createRuleset('Roboto').addProperty('fontWeight', 'normal');

        sheet.addAtRule('@font-face', [ff1, ff2]);

        expect(sheet.toObject()).toEqual({
          '@font-face': [{ fontWeight: 'bold' }, { fontWeight: 'normal' }],
        });
      });

      it('returns a sheet', () => {
        const foo = sheet.createRuleset('foo').addProperty('color', 'red');
        const bar = sheet.createRuleset('bar').addProperty('background', 'blue');

        sheet.addAtRule('@global', new Sheet().addRuleset(foo).addRuleset(bar));

        expect(sheet.toObject()).toEqual({
          '@global': {
            foo: { color: 'red' },
            bar: { background: 'blue' },
          },
        });
      });
    });

    describe('rulesets', () => {
      it('returns rulesets', () => {
        const foo = sheet.createRuleset('foo').addProperty('color', 'red');
        const bar = sheet.createRuleset('bar').addProperty('background', 'blue');

        sheet.addRuleset(foo).addRuleset(bar);

        expect(sheet.toObject()).toEqual({
          foo: { color: 'red' },
          bar: { background: 'blue' },
        });
      });
    });
  });
});
