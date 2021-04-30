import { Rule } from '@aesthetic/types';
import { Theme } from '../src';
import { lightTheme } from '../src/test';

describe('Theme', () => {
  let testTheme: Theme<Rule>;

  beforeEach(() => {
    // Copy so we dont mutate the testing mock
    testTheme = lightTheme.extend({});
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

  describe('mixin()', () => {
    it('errors for an unknown mixin', () => {
      expect(() => {
        // @ts-expect-error Allow invalid type
        testTheme.mixin('unknown-mixin');
      }).toThrow('Unknown mixin "unknown-mixin".');
    });

    it('returns base properties when no options or extra rule passed', () => {
      expect(testTheme.mixin('reset-typography')).toMatchSnapshot();
    });

    it('returns merged properties when no options passed but an extra rule is passed', () => {
      expect(
        testTheme.mixin('reset-typography', {
          fontSize: '60px',
        }),
      ).toMatchSnapshot();
    });

    it('deep merges correctly', () => {
      expect(
        testTheme.mixin('hide-visually', {
          '@selectors': {
            ':hover': {
              color: 'red',
            },
          },
        }),
      ).toMatchSnapshot();
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
