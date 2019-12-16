import { Adapter, Aesthetic, TransformOptions, GLOBAL_STYLE_NAME } from '../src';
import StyleSheetManager from '../src/StyleSheetManager';
import { TestAdapter, TestTheme, setupAesthetic } from '../src/testing';

describe('Adapter', () => {
  let instance: Adapter<{}, {}>;

  beforeEach(() => {
    instance = new TestAdapter();

    setupAesthetic(new Aesthetic(), instance);
  });

  describe('applyGlobalStyles()', () => {
    it('only triggers once for the same params', () => {
      const spy = jest.spyOn(instance, 'flushStyles');

      instance.applyGlobalStyles({});
      instance.applyGlobalStyles({});
      instance.applyGlobalStyles({});

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('only triggers once even when `dir` option changes', () => {
      const spy = jest.spyOn(instance, 'flushStyles');

      instance.applyGlobalStyles({ dir: 'ltr' });
      instance.applyGlobalStyles({ dir: 'rtl' });
      instance.applyGlobalStyles({ dir: 'neutral' });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('does nothing if no global styles defined for theme', () => {
      const spy = jest.spyOn(instance, 'parseStyleSheet');

      instance.applyGlobalStyles({ theme: 'no-globals' });

      expect(spy).not.toHaveBeenCalled();
    });

    it('processes global styles if defined for a theme', () => {
      const spy = jest.spyOn(instance, 'parseStyleSheet');

      instance.applyGlobalStyles({});

      expect(spy).toHaveBeenCalledWith({}, GLOBAL_STYLE_NAME);
    });

    it('sets `ltr` on document', () => {
      instance.aesthetic.configure({ rtl: false });
      instance.applyGlobalStyles();

      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('sets `rtl` on document', () => {
      instance.aesthetic.configure({ rtl: true });
      instance.applyGlobalStyles();

      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });

    it('sets `dir` on document even if no global sheet defined', () => {
      instance.applyGlobalStyles({ theme: 'no-globals' });

      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('caches with correct params', () => {
      const spy = jest.spyOn(instance.getCacheManager(), 'set');

      instance.applyGlobalStyles({ theme: 'dark' });

      expect(spy).toHaveBeenCalledWith(GLOBAL_STYLE_NAME, expect.anything(), {
        global: true,
        name: ':root',
        theme: 'dark',
      });
    });
  });

  // Will have no properties as no unified syntax handlers are defined
  describe('createStyleSheet()', () => {
    beforeEach(() => {
      instance.aesthetic.registerStyleSheet('foo', (theme: TestTheme) => ({
        el: {
          display: 'block',
          padding: theme.unit,
          color: 'black',
        },
      }));
    });

    it('returns the style sheet', () => {
      expect(instance.createStyleSheet('foo', {})).toEqual({
        el: 'el',
      });
    });

    it('calls `convertStyleSheet` for unified syntax while passing theme', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith(
        {
          el: {
            display: 'block',
            padding: 8,
            color: 'black',
          },
        },
        { dir: 'ltr', global: false, name: 'foo', theme: 'default' },
      );
    });

    it('calls `parseStyleSheet` with converted syntax', () => {
      const spy = jest.spyOn(instance, 'parseStyleSheet');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith({ el: {} }, 'foo');
    });

    it('calls `applyGlobalStyles`', () => {
      const spy = jest.spyOn(instance, 'applyGlobalStyles');

      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalled();
    });

    it('caches the result', () => {
      const params: TransformOptions = { dir: 'ltr', global: false, theme: 'light' };

      expect(instance.getCacheManager().get('foo', params)).toBeNull();

      instance.createStyleSheet('foo', params);

      expect(instance.getCacheManager().get('foo', params)).not.toBeNull();

      const sheet = instance.createStyleSheet('foo', params);

      expect(instance.getCacheManager().get('foo', params)).toEqual(sheet);
    });

    it('inherits `rtl` from passed options', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.aesthetic.configure({ rtl: true });
      instance.createStyleSheet('foo', { dir: 'ltr' });

      expect(spy).toHaveBeenCalledWith(expect.anything(), {
        name: 'foo',
        global: false,
        dir: 'ltr',
        theme: 'default',
      });
    });

    it('inherits `rtl` from `Aesthetic` option', () => {
      const spy = jest.spyOn(instance.syntax, 'convertStyleSheet');

      instance.aesthetic.configure({ rtl: true });
      instance.createStyleSheet('foo', {});

      expect(spy).toHaveBeenCalledWith(expect.anything(), {
        name: 'foo',
        global: false,
        dir: 'rtl',
        theme: 'default',
      });
    });
  });

  describe('getStyleSheetManager', () => {
    it('returns and sets a style sheet manager', () => {
      // @ts-ignore Allow access
      expect(instance.sheetManager).toBeNull();

      const manager = instance.getStyleSheetManager();

      // @ts-ignore Allow access
      expect(instance.sheetManager).not.toBeNull();
      expect(manager).toBeInstanceOf(StyleSheetManager);
    });
  });

  describe('parseStyleSheet()', () => {
    it('returns the style sheet as an object', () => {
      const styleSheet = instance.parseStyleSheet({ el: {} }, 'styleName');

      expect(styleSheet).toEqual({ el: 'el' });
    });
  });

  describe('transformStyles()', () => {
    it('errors for invalid value', () => {
      expect(() => {
        instance.transformStyles(
          // @ts-ignore Allow invalid type
          [123],
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('combines strings into a class name', () => {
      expect(instance.transformStyles(['foo', 'bar'], {})).toBe('foo bar');
    });

    it('calls `transformToClassName` method', () => {
      const spy = jest.spyOn(instance, 'transformToClassName');

      instance.transformStyles([{ color: 'red' }, { display: 'block' }], {});

      expect(spy).toHaveBeenCalledWith(['inline-0', 'inline-1']);
    });

    it('ignores falsey values', () => {
      expect(instance.transformStyles([null, false, 0, '', undefined], {})).toBe('');
    });

    it('strips period prefix', () => {
      expect(instance.transformStyles(['.foo', 'bar .qux'], {})).toBe('foo bar qux');
    });

    it('handles expression values', () => {
      expect(instance.transformStyles(['foo', true && 'bar', 5 > 10 && 'baz'], {})).toBe('foo bar');
    });

    it('joins strings', () => {
      expect(instance.transformStyles(['foo', '123', 'bar'], {})).toBe('foo 123 bar');
    });

    it('parses and flushes inline style objects', () => {
      const processSpy = jest.spyOn(instance, 'parseStyleSheet');
      const flushSpy = jest.spyOn(instance, 'flushStyles');

      // @ts-ignore Allow overload
      instance.isParsedBlock = () => false;
      instance.transformStyles([{ color: 'red' }, { display: 'block' }], {});

      expect(processSpy).toHaveBeenCalledWith(
        {
          'inline-0': { color: 'red' },
          'inline-1': { display: 'block' },
        },
        expect.anything(),
      );
      expect(flushSpy).toHaveBeenCalledWith(expect.anything());
    });
  });
});
