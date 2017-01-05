import { expect } from 'chai';
import Aesthetic from '../src/Aesthetic';
import { TestAdapter, TEST_CLASS_NAMES, FONT_ROBOTO } from '../../../tests/mocks';

describe('Aesthetic', () => {
  let instance = null;

  beforeEach(() => {
    instance = new Aesthetic(new TestAdapter());
  });

  describe('extractDeclarations()', () => {
    it('errors if no styles', () => {
      expect(() => instance.extractDeclarations('foo'))
        .to.throw(Error, 'Styles do not exist for "foo".');
    });

    it('errors if no theme', () => {
      instance.styles.foo = {
        display: 'block',
      };

      expect(() => instance.extractDeclarations('foo', 'classic'))
        .to.throw(Error, 'Theme "classic" does not exist.');
    });

    it('returns the object as is', () => {
      instance.styles.foo = {
        display: 'block',
      };

      expect(instance.extractDeclarations('foo')).to.deep.equal({
        display: 'block',
      });
    });

    it('passes the theme to the style callback', () => {
      instance.themes.classic = {
        unitSize: 5,
      };

      instance.styles.foo = (theme: Object) => ({
        padding: theme.unitSize * 2,
      });

      expect(instance.extractDeclarations('foo', 'classic')).to.deep.equal({
        padding: 10,
      });
    });

    it('passes previous styles to style callback', () => {
      instance.themes.classic = {
        unitSize: 5,
      };

      instance.prevStyles.foo = {
        display: 'block',
      };

      instance.styles.foo = (theme: Object, prevStyles: Object) => ({
        padding: theme.unitSize * 2,
        ...prevStyles,
      });

      expect(instance.extractDeclarations('foo', 'classic')).to.deep.equal({
        padding: 10,
        display: 'block',
      });
    });
  });

  describe('registerTheme()', () => {
    it('errors if a theme name has been used', () => {
      instance.themes.foo = {};

      expect(() => instance.registerTheme('foo'))
        .to.throw(Error, 'Theme "foo" already exists.');
    });

    it('errors if a theme style is not an object', () => {
      expect(() => instance.registerTheme('foo', 123))
        .to.throw(Error, 'Theme "foo" must be a style object.');
    });

    it('errors if global styles is not an object', () => {
      expect(() => instance.registerTheme('foo', {}, 123))
        .to.throw(Error, 'Global styles for "foo" must be an object.');
    });

    it('registers theme and transforms global styles', () => {
      expect(instance.themes).to.not.have.property('foo');
      expect(instance.adapter.fontFaces).to.not.have.property('roboto');

      instance.registerTheme('foo', { unitSize: 6 }, {
        '@font-face': {
          roboto: FONT_ROBOTO,
        },
      });

      expect(instance.themes).to.deep.equal({
        foo: { unitSize: 6 },
      });
      expect(instance.adapter.fontFaces).to.deep.equal({
        Roboto: FONT_ROBOTO,
      });
    });
  });

  describe('setAdapter()', () => {
    it('errors if not an instance of `Adapter`', () => {
      expect(() => instance.setAdapter(true)).to.throw(TypeError);
      expect(() => instance.setAdapter(123)).to.throw(TypeError);
      expect(() => instance.setAdapter('foo')).to.throw(TypeError);
      expect(() => instance.setAdapter({})).to.throw(TypeError);
      expect(() => instance.setAdapter([])).to.throw(TypeError);
    });

    it('sets an adapter', () => {
      const adapter = new TestAdapter();

      expect(instance.adapter).to.not.equal(adapter);

      instance.setAdapter(adapter);

      expect(instance.adapter).to.equal(adapter);
    });
  });

  describe('setStyles()', () => {
    it('errors if styles have been set', () => {
      instance.styles.foo = {};

      expect(() => instance.setStyles('foo', {}))
        .to.throw(Error, 'Styles have already been set for "foo".');
    });

    it('errors if styles are empty', () => {
      expect(() => instance.setStyles('foo'))
        .to.throw(TypeError, 'Styles defined for "foo" must be an object or function.');
    });

    it('errors if styles are not an object', () => {
      expect(() => instance.setStyles('foo', 123)).to.throw(TypeError);
      expect(() => instance.setStyles('foo', 'abc')).to.throw(TypeError);
      expect(() => instance.setStyles('foo', [])).to.throw(TypeError);
      expect(() => instance.setStyles('foo', true)).to.throw(TypeError);
    });

    it('sets styles', () => {
      expect(instance.styles.foo).to.be.an('undefined');

      instance.setStyles('foo', {
        header: { color: 'red' },
        footer: { padding: 5 },
      });

      expect(instance.styles.foo).to.deep.equal({
        header: { color: 'red' },
        footer: { padding: 5 },
      });
    });
  });

  describe('transformStyles()', () => {
    it('errors if no styles have been defined', () => {
      expect(() => instance.transformStyles('foo')).to.throw(Error);
    });

    it('returns the cached and transformed class names', () => {
      instance.classNames['foo:'] = { ...TEST_CLASS_NAMES };

      expect(instance.transformStyles('foo')).to.deep.equal(TEST_CLASS_NAMES);
    });

    it('returns an object of strings as is', () => {
      expect(instance.classNames['foo:']).to.be.an('undefined');

      instance.styles.foo = { ...TEST_CLASS_NAMES };

      expect(instance.transformStyles('foo')).to.deep.equal(TEST_CLASS_NAMES);
      expect(instance.classNames['foo:']).to.deep.equal(TEST_CLASS_NAMES);
    });

    it('errors if the adapter does not return a string', () => {
      instance.setAdapter(new TestAdapter());
      instance.setStyles('foo', {
        header: { color: 'red' },
      });

      expect(() => instance.transformStyles('foo'))
        .to.throw(TypeError, '`TestAdapter` must return a mapping of CSS class names. "foo@header" is not a valid string.');
    });

    it('sets and caches styles', () => {
      expect(instance.classNames['bar:']).to.be.an('undefined');

      instance.setAdapter(new TestAdapter());
      instance.setStyles('bar', {
        header: { color: 'red' },
        footer: { color: 'blue' },
      });
      instance.transformStyles('bar');

      expect(instance.classNames['bar:']).to.deep.equal(TEST_CLASS_NAMES);
    });
  });
});
