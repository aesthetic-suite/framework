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

    it('inherits styles from parent', () => {
      instance.setStyles('foo', (theme: Object, prevStyles: Object) => ({
        ...prevStyles,
        color: 'red',
      }));

      instance.setStyles('bar', (theme: Object, prevStyles: Object) => ({
        ...prevStyles,
        background: 'blue',
      }), 'foo');

      instance.setStyles('baz', (theme: Object, prevStyles: Object) => ({
        ...prevStyles,
        display: 'block',
      }), 'bar');

      expect(instance.extractDeclarations('foo')).to.deep.equal({
        color: 'red',
      });

      expect(instance.extractDeclarations('bar')).to.deep.equal({
        color: 'red',
        background: 'blue',
      });

      expect(instance.extractDeclarations('baz')).to.deep.equal({
        color: 'red',
        background: 'blue',
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

    it('errors if extended styles do not exist', () => {
      expect(() => instance.setStyles('foo', {}, 'parent'))
        .to.throw(Error, 'Cannot extend from "parent" as those styles do not exist.');
    });

    it('errors if extended and style names match', () => {
      expect(() => instance.setStyles('foo', {}, 'foo'))
        .to.throw(Error, 'Cannot extend styles from itself.');
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

    it('sets styles and extends parents', () => {
      expect(instance.styles.bar).to.be.an('undefined');
      expect(instance.parents.bar).to.be.an('undefined');

      instance.setStyles('foo', {
        header: { color: 'red' },
        footer: { padding: 5 },
      });

      instance.setStyles('bar', {
        child: { margin: 5 },
      }, 'foo');

      expect(instance.styles.bar).to.deep.equal({
        child: { margin: 5 },
      });
      expect(instance.parents.bar).to.equal('foo');
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
