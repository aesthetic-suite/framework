import { Theme } from '../src';
import { lightTheme } from '../src/testing';

describe('Theme', () => {
  let testTheme: Theme;

  beforeEach(() => {
    // Copy so we dont mutate the testing mock
    testTheme = lightTheme.extend({});
  });

  it('sets class properties', () => {
    expect(lightTheme.contrast).toBe('normal');
    expect(lightTheme.scheme).toBe('light');
  });

  it('can extend and create a new theme', () => {
    const newTheme = lightTheme.extend(
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
    expect(newTheme.toTokens().palette.brand.color['00']).toBe('red');
  });

  it('inherits the parents customized mixins', () => {
    testTheme.extendMixin('heading-l1', { background: 'red' });
    testTheme.overwriteMixin('background-neutral', { background: 'blue' });

    const clonedTheme = testTheme.extend({});

    expect(clonedTheme.mixin('heading-l1')).toHaveProperty('background', 'red');
    expect(clonedTheme.mixin('background-neutral')).toEqual({ background: 'blue' });
  });

  describe('extendMixin()', () => {
    it('can extend a mixing with additional properties', () => {
      expect(testTheme.mixin('text-df')).toMatchSnapshot();

      testTheme.extendMixin('text-df', {
        fontWeight: 'bold',
        color: 'red',
        display: 'inline-block',
        opacity: 1,
      });

      expect(testTheme.mixin('text-df')).toMatchSnapshot();
    });

    it('will deep merge properties', () => {
      expect(testTheme.mixin('border-df')).toMatchSnapshot();

      testTheme.extendMixin('border-df', {
        ':focus': {
          outline: 'none',
        },
      });

      expect(testTheme.mixin('border-df')).toMatchSnapshot();
    });

    it('errors for unknown path', () => {
      expect(() => {
        // @ts-expect-error
        testTheme.extendMixin('border-unknown');
      }).toThrow('Unknown mixin "border-unknown".');
    });
  });

  describe('mixin()', () => {
    it('merges objects with mixin', () => {
      expect(
        lightTheme.mixin('text-df', {
          fontWeight: 'bold',
          fontSize: '24px',
        }),
      ).toMatchSnapshot();
    });

    it('can merge from multiple targets', () => {
      expect(
        lightTheme.mixin(['heading-l3', 'text-df', 'background-neutral'], {
          color: 'red',
        }),
      ).toMatchSnapshot();
    });
  });

  describe('overwriteMixin()', () => {
    it('can completely replace an existing mixin', () => {
      expect(testTheme.mixin('text-df')).toMatchSnapshot();

      testTheme.overwriteMixin('text-df', {
        fontSize: '20px',
      });

      expect(testTheme.mixin('text-df')).toMatchSnapshot();
    });
  });

  describe('toUtilities()', () => {
    it('returns all factory methods', () => {
      expect(lightTheme.toUtilities()).toEqual({
        mixin: lightTheme.mixin,
        unit: lightTheme.unit,
        var: lightTheme.var,
      });
    });
  });

  describe('toTokens()', () => {
    it('returns design and theme tokens', () => {
      const tokens = lightTheme.toTokens();

      expect(tokens.spacing.lg).toBeDefined();
      expect(tokens.palette.warning).toBeDefined();
    });
  });

  describe('toVariables()', () => {
    it('returns tokens as a flat object of CSS variables', () => {
      expect(lightTheme.toVariables()).toMatchSnapshot();
    });

    it('caches and returns same instance', () => {
      const a = lightTheme.toVariables();
      const b = lightTheme.toVariables();

      expect(a).toBe(b);
    });
  });

  describe('unit()', () => {
    it('generates a rem unit', () => {
      expect(lightTheme.unit(-3.15)).toBe('-3.94rem');
      expect(lightTheme.unit(1)).toBe('1.25rem');
      expect(lightTheme.unit(6.25)).toBe('7.81rem');
    });

    it('supports multiple values', () => {
      expect(lightTheme.unit(1, 2, 3, 4)).toBe('1.25rem 2.50rem 3.75rem 5rem');
    });
  });

  describe('var()', () => {
    it('returns a CSS var', () => {
      expect(lightTheme.var('breakpoint-lg-root-line-height')).toBe(
        'var(--breakpoint-lg-root-line-height)',
      );
    });

    it('supports multiple fallbacks', () => {
      expect(lightTheme.var('border-lg-radius', lightTheme.var('border-df-radius'), '10px')).toBe(
        'var(--border-lg-radius, var(--border-df-radius), 10px)',
      );
    });
  });
});
