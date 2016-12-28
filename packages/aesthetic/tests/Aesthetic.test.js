import { expect } from 'chai';
import Aesthetic from '../src/Aesthetic';
import Adapter from '../src/Adapter';
import { TestAdapter, TEST_CLASS_NAMES } from '../../../tests/mocks';

describe('Aesthetic', () => {
  let instance = null;

  beforeEach(() => {
    instance = new Aesthetic(new Adapter());
  });

  describe('lockStyling()', () => {
    it('does not lock styles if no style definition exists', () => {
      expect(instance.locked.foo).to.be.an('undefined');

      instance.lockStyling('foo');

      expect(instance.locked.foo).to.be.an('undefined');
    });

    it('locks styles if a style definition exists', () => {
      expect(instance.locked.foo).to.be.an('undefined');

      instance.setStyles('foo', {});
      instance.lockStyling('foo');

      expect(instance.locked.foo).to.equal(true);
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
    it('errors if styles are locked', () => {
      instance.locked.foo = true;

      expect(() => instance.setStyles('foo', {})).to.throw(Error);
    });

    it('errors if styles have been transformed', () => {
      instance.classNames.foo = {};

      expect(() => instance.setStyles('foo', {})).to.throw(Error);
    });

    it('errors if styles are empty', () => {
      expect(() => instance.setStyles('foo')).to.throw(TypeError);
      expect(() => instance.setStyles('foo', null)).to.throw(TypeError);
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

    it('sets an array of styles', () => {
      expect(instance.styles.foo).to.be.an('undefined');

      instance.setStyles('foo', {
        header: [
          { color: 'red' },
          { padding: 5 },
        ],
      });

      expect(instance.styles.foo).to.deep.equal({
        header: [
          { color: 'red' },
          { padding: 5 },
        ],
      });
    });

    it('overrides previous styles', () => {
      instance.styles.foo = {
        header: { color: 'red' },
        footer: { padding: 5, margin: 5 },
      };

      instance.setStyles('foo', {
        header: { color: 'blue' },
        footer: { padding: 10 },
      });

      expect(instance.styles.foo).to.deep.equal({
        header: { color: 'blue' },
        footer: { padding: 10 },
      });
    });

    it('deep merges with previous styles', () => {
      instance.styles.foo = {
        header: {
          color: 'red',
          width: '100%',
        },
        footer: {
          padding: 5,
          margin: 5,
          ':hover': {
            backgroundColor: 'black',
          },
        },
      };

      instance.setStyles('foo', {
        header: {
          color: 'blue',
          lineHeight: 1.5,
        },
        footer: {
          padding: 10,
          ':hover': {
            height: 50,
          },
        },
      }, true);

      expect(instance.styles.foo).to.deep.equal({
        header: {
          color: 'blue',
          width: '100%',
          lineHeight: 1.5,
        },
        footer: {
          padding: 10,
          margin: 5,
          ':hover': {
            backgroundColor: 'black',
            height: 50,
          },
        },
      });
    });
  });

  describe('transformStyles()', () => {
    it('errors if no styles have been defined', () => {
      expect(() => instance.transformStyles('foo')).to.throw(Error);
    });

    it('returns the cached and transformed class names', () => {
      instance.classNames.foo = { ...TEST_CLASS_NAMES };

      expect(instance.transformStyles('foo')).to.deep.equal(TEST_CLASS_NAMES);
    });

    it('returns an object of strings as is', () => {
      expect(instance.classNames.foo).to.be.an('undefined');

      instance.styles.foo = { ...TEST_CLASS_NAMES };

      expect(instance.transformStyles('foo')).to.deep.equal(TEST_CLASS_NAMES);
      expect(instance.classNames.foo).to.deep.equal(TEST_CLASS_NAMES);
    });

    it('errors if the adapter does not return a string', () => {
      instance.setAdapter(new TestAdapter());
      instance.setStyles('foo', {
        header: { color: 'red' },
      });

      expect(() => instance.transformStyles('foo'))
        .to.throw(TypeError, '`TestAdapter` must return a mapping of CSS class names. `foo@header` is not a valid string.');
    });

    it('sets and caches styles', () => {
      expect(instance.classNames.bar).to.be.an('undefined');

      instance.setAdapter(new TestAdapter());
      instance.setStyles('bar', {
        header: { color: 'red' },
        footer: { color: 'blue' },
      });
      instance.transformStyles('bar');

      expect(instance.classNames.bar).to.deep.equal(TEST_CLASS_NAMES);
    });
  });
});
