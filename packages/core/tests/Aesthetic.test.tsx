import Aesthetic from '../src/Aesthetic';
import { setupAesthetic, SYNTAX_GLOBAL } from '../src/testing';

describe('Aesthetic', () => {
  let instance: Aesthetic;

  beforeEach(() => {
    instance = new Aesthetic();

    setupAesthetic(instance);
  });

  describe('configure()', () => {
    it('merges options', () => {
      instance.configure({
        cxPropName: 'css',
        stylesPropName: 'styleSheet',
      });

      expect(instance.options).toEqual(
        expect.objectContaining({
          cxPropName: 'css',
          passThemeProp: false,
          rtl: false,
          stylesPropName: 'styleSheet',
          theme: 'default',
          themePropName: 'theme',
        }),
      );
    });
  });

  describe('changeTheme()', () => {
    it('errors for invalid theme name', () => {
      expect(() => {
        instance.changeTheme('unknown');
      }).toThrowErrorMatchingSnapshot();
    });

    it('changes the theme option', () => {
      expect(instance.options.theme).toBe('default');

      instance.changeTheme('light');

      expect(instance.options.theme).toBe('light');
    });

    it('resets old global styles', () => {
      const spy = jest.spyOn(instance.getAdapter(), 'resetGlobalStyles');

      instance.changeTheme('light');

      expect(spy).toHaveBeenCalledWith('light');
    });

    it('applies new global styles', () => {
      const spy = jest.spyOn(instance.getAdapter(), 'applyGlobalStyles');

      instance.changeTheme('light');

      expect(spy).toHaveBeenCalledWith({ theme: 'light' });
    });
  });

  describe('extendStyles()', () => {
    it('returns a stylesheet', () => {
      const styleSheet = instance.extendStyles(() => ({ element: { display: 'block' } }));

      expect(typeof styleSheet).toBe('function');
      expect(styleSheet({ color: 'black', unit: 8 })).toEqual({ element: { display: 'block' } });
    });

    it('passes theme variables', () => {
      const styleSheet = instance.extendStyles(theme => ({
        element: { padding: theme.unit },
      }));

      expect(styleSheet({ color: 'black', unit: 8 })).toEqual({ element: { padding: 8 } });
    });

    it('deep merges multiple stylesheets', () => {
      const styleSheet = instance.extendStyles(
        theme => ({ element: { padding: theme.unit } }),
        () => ({ element: { display: 'block' } }),
        ({ color }) => ({ elementActive: { color } }),
      );

      expect(styleSheet({ unit: 8, color: 'red' })).toEqual({
        element: { padding: 8, display: 'block' },
        elementActive: { color: 'red' },
      });
    });
  });

  describe('getGlobalSheet', () => {
    it('errors if no theme', () => {
      expect(() => {
        instance.getGlobalSheet('unknown');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the global sheet', () => {
      expect(instance.getGlobalSheet('default')).toEqual({
        '@global': {
          body: {
            padding: 8,
          },
        },
      });
    });
  });

  describe('getStyleSheet()', () => {
    beforeEach(() => {
      instance.registerStyleSheet('foo', () => ({
        el: { display: 'block' },
      }));
    });

    it('errors if no theme', () => {
      expect(() => {
        instance.getStyleSheet('foo', 'unknown');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the style sheet', () => {
      expect(instance.getStyleSheet('foo', 'default')).toEqual({
        el: { display: 'block' },
      });
    });

    it('passes theme to the style callback', () => {
      instance.registerStyleSheet('bar', theme => ({
        el: { padding: theme.unit * 2 },
      }));

      expect(instance.getStyleSheet('bar', 'default')).toEqual({
        el: { padding: 16 },
      });
    });

    it('inherits styles from parent', () => {
      instance.registerStyleSheet('bar', () => ({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      }));

      instance.registerStyleSheet(
        'baz',
        () => ({
          el: {
            background: 'blue',
            ':hover': {
              color: 'green',
            },
          },
        }),
        'bar',
      );

      instance.registerStyleSheet(
        'qux',
        () => ({
          el: { display: 'block' },
        }),
        'baz',
      );

      expect(instance.getStyleSheet('bar', 'default')).toEqual({
        el: {
          color: 'red',
          ':hover': {
            color: 'darkred',
          },
        },
      });

      expect(instance.getStyleSheet('baz', 'default')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          ':hover': {
            color: 'green',
          },
        },
      });

      expect(instance.getStyleSheet('qux', 'default')).toEqual({
        el: {
          color: 'red',
          background: 'blue',
          display: 'block',
          ':hover': {
            color: 'green',
          },
        },
      });
    });
  });

  describe('getTheme()', () => {
    it('errors if the theme doesnt exist', () => {
      expect(() => {
        instance.getTheme('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if the theme is not an object', () => {
      // @ts-ignore Allow invalid type
      instance.themes.default = 123;

      expect(() => {
        instance.getTheme('default');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the theme by name', () => {
      expect(instance.getTheme('default')).toEqual({ bg: 'gray', color: 'black', unit: 8 });
    });
  });

  describe('registerStyleSheet()', () => {
    it('errors if styles try to extend from itself', () => {
      instance.styleSheets.foo = () => ({});

      expect(() => {
        instance.registerStyleSheet('foo', () => ({}), 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if styles are not a function', () => {
      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          123,
        ),
      ).toThrowErrorMatchingSnapshot();

      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          'abc',
        ),
      ).toThrowErrorMatchingSnapshot();

      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          [],
        ),
      ).toThrowErrorMatchingSnapshot();

      expect(() =>
        instance.registerStyleSheet(
          'foo',
          // @ts-ignore Allow non-function
          true,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if extended styles do not exist', () => {
      expect(() =>
        instance.registerStyleSheet('foo', () => ({}), 'parent'),
      ).toThrowErrorMatchingSnapshot();
    });

    it('sets styles', () => {
      expect(instance.styleSheets.foo).toBeUndefined();

      instance.registerStyleSheet('foo', () => ({
        header: { color: 'red' },
        footer: { padding: 5 },
      }));

      expect(instance.styleSheets.foo).toBeDefined();
    });

    describe('extending parent', () => {
      it('sets styles and merges with parent', () => {
        expect(instance.styleSheets.bar).toBeUndefined();
        expect(instance.parents.bar).toBeUndefined();

        instance.registerStyleSheet('foo', () => ({
          header: { color: 'red' },
          footer: { padding: 5 },
        }));

        instance.registerStyleSheet(
          'bar',
          () => ({
            child: { margin: 5 },
          }),
          'foo',
        );

        expect(instance.parents.bar).toBe('foo');
      });
    });
  });

  describe('registerTheme()', () => {
    it('errors if a theme name has been used', () => {
      expect(() =>
        instance.registerTheme(
          'default',
          // @ts-ignore Allow empty
          {},
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if a theme style is not an object', () => {
      expect(() =>
        instance.registerTheme(
          'foo',
          // @ts-ignore Allow invalid type
          123,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if global styles is not an object', () => {
      expect(() =>
        instance.registerTheme(
          'foo',
          // @ts-ignore Allow empty
          {},
          // @ts-ignore Allow non-object
          123,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('registers theme and sets global styles', () => {
      expect(instance.globalSheets.foo).toBeUndefined();

      instance.registerTheme('foo', { color: 'red', unit: 6 }, () => SYNTAX_GLOBAL);

      expect(instance.themes.foo).toEqual({ color: 'red', unit: 6 });

      expect(instance.globalSheets.foo).toBeDefined();
    });

    describe('extending parent', () => {
      it('errors if the parent theme doesnt exist', () => {
        expect(() =>
          instance.registerTheme('bar', {}, null, 'unknown-parent'),
        ).toThrowErrorMatchingSnapshot();
      });

      it('deep merges the parent and child theme', () => {
        instance.registerTheme('foo', {
          color: 'red',
          unit: 8,
        });

        instance.registerTheme(
          'bar',
          {
            color: 'blue',
          },
          null,
          'foo',
        );

        expect(instance.themes.bar).toEqual({
          color: 'blue',
          unit: 8,
        });
      });

      it('inherits parent theme global styles', () => {
        const spy = jest.fn();

        instance.registerTheme('foo', { color: 'red', unit: 8 }, spy);
        instance.registerTheme('bar', {}, null, 'foo');

        expect(instance.globalSheets.bar).toBe(spy);
      });
    });
  });
});
