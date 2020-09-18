/* eslint-disable babel/no-invalid-this */

import { Theme, Utilities } from '../src';
import { lightTheme } from '../src/testing';

describe('Theme', () => {
  let testTheme: Theme;

  beforeEach(() => {
    // Copy so we dont mutate the testing mock
    testTheme = lightTheme.extend({});

    testTheme.registerMixin('text', function texts(
      this: Utilities,
      { size = 'df' }: { size?: string },
    ) {
      return {
        color: this.var('palette-neutral-fg-base'),
        fontFamily: this.var('typography-font-text'),
        fontSize: this.var(`text-${size}-size` as 'text-df-size'),
        lineHeight: this.var(`text-${size}-line-height` as 'text-df-line-height'),
      };
    });
  });

  it('sets class properties', () => {
    expect(testTheme.contrast).toBe('normal');
    expect(testTheme.scheme).toBe('light');
  });

  it('can extend and create a new theme', () => {
    const newTheme = testTheme.extend(
      {
        palette: {
          brand: {
            color: {
              '00': 'red',
            },
          },
        },
      },
      { contrast: 'high' },
    );

    expect(newTheme).toBeInstanceOf(Theme);
    expect(newTheme.contrast).toBe('high');
    expect(newTheme.scheme).toBe('light');
    expect(newTheme.tokens.palette.brand.color['00']).toBe('red');
  });

  it('inherits the parents customized mixins', () => {
    testTheme.extendMixin('heading', () => ({ background: 'red' }));

    const clonedTheme = testTheme.extend({});

    expect(clonedTheme.mixin('heading')).toHaveProperty('background', 'red');
  });

  describe('extendMixin()', () => {
    it('creates a template set for the defined name', () => {
      // @ts-expect-error Allow access
      expect(testTheme.templates.test).toBeUndefined();

      testTheme.extendMixin('test', () => ({}));

      // @ts-expect-error Allow access
      expect(testTheme.templates.test).toBeInstanceOf(Set);
    });

    it('doesnt set the same template twice', () => {
      const template = () => ({});

      testTheme.extendMixin('test', template);
      testTheme.extendMixin('test', template);
      testTheme.extendMixin('test', template);

      // @ts-expect-error Allow access
      expect(testTheme.templates.test.size).toBe(1);
    });

    it('can extend a mixin with additional properties', () => {
      expect(testTheme.mixin('text')).toMatchSnapshot();

      testTheme.extendMixin('text', () => ({
        fontWeight: 'bold',
        color: 'red',
        display: 'inline-block',
        opacity: 1,
      }));

      expect(testTheme.mixin('text')).toMatchSnapshot();
    });

    it('can utilize the same options as the parent mixin', () => {
      testTheme.extendMixin('text', ({ size }: { size?: string }) => ({
        fontWeight: size === 'lg' ? 'bold' : 'normal',
      }));

      expect(testTheme.mixin('text')).toMatchSnapshot();
      expect(testTheme.mixin('text', { size: 'lg' })).toMatchSnapshot();
    });

    it('will deep merge properties', () => {
      testTheme.registerMixin('example', () => ({
        display: 'block',
        ':focus': {
          color: 'red',
        },
      }));

      testTheme.extendMixin('example', () => ({
        ':focus': {
          outline: 'none',
        },
      }));

      expect(testTheme.mixin('example')[':focus']).toEqual({
        color: 'red',
        outline: 'none',
      });
    });
  });

  describe('mixin()', () => {
    it('returns an empty object for an unknown mixin', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      expect(testTheme.mixin('unknown-mixin')).toEqual({});
      expect(spy).toHaveBeenCalledWith('Unknown mixin "unknown-mixin".');

      spy.mockRestore();
    });

    it('merges multiple templates with base mixin', () => {
      testTheme.extendMixin('text', () => ({ fontWeight: 'bold' }));
      testTheme.extendMixin('text', () => ({ fontSize: '24px' }));

      expect(testTheme.mixin('text')).toMatchSnapshot();
    });

    it('merges additional rules with base mixin', () => {
      expect(
        testTheme.mixin(
          'text',
          {},
          {
            fontWeight: 'bold',
          },
          {
            fontSize: '24px',
          },
        ),
      ).toMatchSnapshot();
    });

    it('merges templates and rules with base mixin', () => {
      testTheme.extendMixin('text', () => ({ fontWeight: 'bold' }));

      expect(testTheme.mixin('text', {}, { fontSize: '24px' })).toMatchSnapshot();
    });

    it('allows additional rules to overwrite templates and mixin', () => {
      testTheme.extendMixin('text', () => ({ fontWeight: 'bold' }));

      expect(testTheme.mixin('text', {}, { fontWeight: 800 })).toMatchSnapshot();
    });
  });

  describe('registerMixin()', () => {
    it('errors if trying to overwrite an existing mixin', () => {
      expect(() => {
        testTheme.registerMixin('text', () => ({}));
        testTheme.registerMixin('text', () => ({}));
      }).toThrow('A mixin already exists for "text". Cannot overwrite.');
    });

    it('registers a custom mixin', () => {
      // @ts-expect-error Allow access
      expect(testTheme.mixins.custom).toBeUndefined();

      const template = () => ({});
      testTheme.registerMixin('custom', template);

      // @ts-expect-error Allow access
      expect(testTheme.mixins.custom).toBe(template);
    });
  });

  describe('toVariables()', () => {
    it('returns tokens as a flat object of CSS variables', () => {
      expect(testTheme.toVariables()).toMatchSnapshot();
    });

    it('caches and returns same instance', () => {
      const a = testTheme.toVariables();
      const b = testTheme.toVariables();

      expect(a).toBe(b);
    });
  });

  describe('token()', () => {
    it('returns a value', () => {
      expect(testTheme.token('breakpoint-lg-root-line-height')).toBe(1.62);
      expect(testTheme.token('palette-brand-color-20')).toBe('#fff');
    });

    it('errors for invalid token path', () => {
      expect(() => {
        testTheme.token(
          // @ts-expect-error
          'some-fake-value',
        );
      }).toThrow('Unknown token "some-fake-value".');
    });
  });

  describe('unit()', () => {
    it('generates a rem unit', () => {
      expect(testTheme.unit(-3.15)).toBe('-3.94rem');
      expect(testTheme.unit(1)).toBe('1.25rem');
      expect(testTheme.unit(6.25)).toBe('7.81rem');
    });

    it('supports multiple values', () => {
      expect(testTheme.unit(1, 2, 3, 4)).toBe('1.25rem 2.50rem 3.75rem 5rem');
    });
  });

  describe('var()', () => {
    it('returns a CSS var', () => {
      expect(testTheme.var('breakpoint-lg-root-line-height')).toBe(
        'var(--breakpoint-lg-root-line-height)',
      );
    });

    it('supports multiple fallbacks', () => {
      expect(testTheme.var('border-lg-radius', testTheme.var('border-df-radius'), '10px')).toBe(
        'var(--border-lg-radius, var(--border-df-radius), 10px)',
      );
    });
  });
});
