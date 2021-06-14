import { FontFace, NativeProperty, VendorPrefixer } from '@aesthetic/types';
import {
  createDeclaration,
  formatDeclaration,
  formatFontFace,
  formatImport,
  formatProperty,
  formatRule,
  formatValue,
  formatVariable,
  formatVariableBlock,
  StyleEngine,
} from '../src';
import { createTestStyleEngine } from '../src/test';

const font: FontFace = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  local: ['Robo'],
  srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
};

const fontFlat: FontFace = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src:
    "local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
};

describe('syntax', () => {
  let engine: StyleEngine;

  beforeEach(() => {
    engine = createTestStyleEngine();
  });

  describe('createDeclaration()', () => {
    it('returns a formatted key-value pair', () => {
      expect(createDeclaration('textAlign', 'left', {}, engine)).toBe('text-align:left;');
    });

    describe('direction converter', () => {
      beforeEach(() => {
        engine.direction = 'ltr';
      });

      it('returns as-is if same direction', () => {
        engine.directionConverter = {
          convert: (from, to, property, value) => ({ property, value }),
        };

        expect(
          createDeclaration(
            'textAlign',
            'left',
            {
              direction: 'ltr',
            },
            engine,
          ),
        ).toBe('text-align:left;');
      });

      it('converts value', () => {
        engine.directionConverter = {
          convert: (from, to, property, value) => ({
            property,
            value: (value === 'left' ? 'right' : 'left') as typeof value,
          }),
        };

        expect(
          createDeclaration(
            'textAlign',
            'left',
            {
              direction: 'rtl',
            },
            engine,
          ),
        ).toBe('text-align:right;');
        expect(
          createDeclaration(
            'textAlign',
            'right',
            {
              direction: 'rtl',
            },
            engine,
          ),
        ).toBe('text-align:left;');
      });

      it('converts property', () => {
        engine.directionConverter = {
          convert: (from, to, property, value) => ({
            property: (property.includes('left')
              ? property.replace('left', 'right')
              : property.replace('right', 'left')) as NativeProperty,
            value,
          }),
        };

        expect(
          createDeclaration(
            'padding-left',
            '10px',
            {
              direction: 'rtl',
            },
            engine,
          ),
        ).toBe('padding-right:10px;');
        expect(
          createDeclaration(
            'padding-right',
            '10px',
            {
              direction: 'rtl',
            },
            engine,
          ),
        ).toBe('padding-left:10px;');
      });
    });

    describe('vendor prefixing', () => {
      const prefixer: VendorPrefixer = {
        prefix(property, value) {
          return { [property]: value };
        },
        prefixSelector(selector, rule) {
          return rule;
        },
      };

      it('sets multiple prefixed values', () => {
        engine.vendorPrefixer = {
          ...prefixer,
          prefix(property, value) {
            return { [property]: [`-moz-${value}`, `-webkit-${value}`, value] };
          },
        };

        expect(
          createDeclaration(
            'display',
            'flex',
            {
              vendor: true,
            },
            engine,
          ),
        ).toBe('display:-moz-flex;display:-webkit-flex;display:flex;');
      });

      it('sets multiple prefixed properties', () => {
        engine.vendorPrefixer = {
          ...prefixer,
          prefix(property, value) {
            return {
              [`-moz-${property}`]: value,
              [`-webkit-${property}`]: value,
              [property]: value,
            };
          },
        };

        expect(
          createDeclaration(
            'border-radius',
            '3px',
            {
              vendor: true,
            },
            engine,
          ),
        ).toBe('-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;');
      });

      it('supports prefixed properties and values in parallel', () => {
        engine.vendorPrefixer = {
          ...prefixer,
          prefix(property, value) {
            const values = [`-moz-${value}`, `-webkit-${value}`, value];

            return {
              [`-moz-${property}`]: values,
              [`-webkit-${property}`]: values,
              [property]: values,
            };
          },
        };

        expect(
          createDeclaration(
            'display',
            'flex',
            {
              vendor: true,
            },
            engine,
          ),
        ).toBe(
          '-moz-display:-moz-flex;-moz-display:-webkit-flex;-moz-display:flex;-webkit-display:-moz-flex;-webkit-display:-webkit-flex;-webkit-display:flex;display:-moz-flex;display:-webkit-flex;display:flex;',
        );
      });
    });
  });

  describe('formatFontFace()', () => {
    it('converts the src array to a string with formats', () => {
      expect(formatFontFace(font)).toEqual(fontFlat);
    });

    it('supports flat src strings', () => {
      expect(formatFontFace(fontFlat)).toEqual(fontFlat);
    });

    it('includes local aliases with src paths', () => {
      expect(
        formatFontFace({
          ...font,
          local: ['MrRoboto'],
        }),
      ).toEqual({
        ...fontFlat,
        src:
          "local('MrRoboto'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
      });
    });

    it('ignores local aliases for flat src strings', () => {
      expect(
        formatFontFace({
          ...fontFlat,
          local: ['MrRoboto'],
        }),
      ).toEqual(fontFlat);
    });

    it('throws for an unsupported format', () => {
      expect(() => {
        formatFontFace({
          ...font,
          srcPaths: ['Roboto.foo'],
        });
      }).toThrow('Unsupported font format ".foo".');
    });

    it('supports paths with query strings', () => {
      expect(
        formatFontFace({
          ...font,
          srcPaths: ['Roboto.woff2?abc'],
        }),
      ).toEqual({
        ...fontFlat,
        src: "local('Robo'), url('Roboto.woff2?abc') format('woff2')",
      });
    });
  });

  describe('formatImport()', () => {
    it('returns strings as is', () => {
      expect(formatImport('"test.css"')).toBe('"test.css"');
      expect(formatImport('"test.css" screen')).toBe('"test.css" screen');
      expect(formatImport('url("test.css") screen')).toBe('url("test.css") screen');
    });

    it('formats path', () => {
      expect(formatImport({ path: 'test.css' })).toBe('"test.css"');
    });

    it('formats path wrapped in url()', () => {
      expect(formatImport({ path: 'test.css', url: true })).toBe('url("test.css")');
    });

    it('formats path and media', () => {
      expect(formatImport({ path: 'test.css', media: 'screen' })).toBe('"test.css" screen');
    });

    it('formats everything', () => {
      expect(formatImport({ path: 'test.css', media: 'screen', url: true })).toBe(
        'url("test.css") screen',
      );
    });
  });

  describe('formatProperty()', () => {
    it('returns as-is if formatted correctly', () => {
      expect(formatProperty('foo')).toBe('foo');
      expect(formatProperty('foo-bar')).toBe('foo-bar');
    });

    it('hyphenates if in camel case', () => {
      expect(formatProperty('fooBar')).toBe('foo-bar');
    });
  });

  describe('formatDeclaration() + formatRule()', () => {
    it('returns declaration within class name block', () => {
      expect(formatRule('class', formatDeclaration('display', 'block'), {})).toBe(
        '.class { display:block; }',
      );
    });

    it('formats an array of values as multiple properties', () => {
      expect(
        formatRule('class', formatDeclaration('display', ['box', 'flexbox', 'flex']), {}),
      ).toBe('.class { display:box;display:flexbox;display:flex; }');
    });

    it('can add a selector', () => {
      expect(
        formatRule('class', formatDeclaration('display', 'block'), { selector: ':hover' }),
      ).toBe('.class:hover { display:block; }');
    });

    it('can wrap in a media condition', () => {
      expect(
        formatRule('class', formatDeclaration('display', 'block'), {
          selector: ':hover',
          media: '(min-width: 100px)',
        }),
      ).toBe('@media (min-width: 100px) { .class:hover { display:block; } }');
    });

    it('can wrap in a supports condition', () => {
      expect(
        formatRule('class', formatDeclaration('display', 'block'), {
          selector: ':hover',
          media: '(min-width: 100px)',
          supports: 'not (display: flex)',
        }),
      ).toBe(
        '@supports not (display: flex) { @media (min-width: 100px) { .class:hover { display:block; } } }',
      );
    });
  });

  describe('formatValue()', () => {
    it('returns as-is if a string', () => {
      expect(formatValue('padding', '10px', {}, engine)).toBe('10px');
      expect(formatValue('content', '"content"', {}, engine)).toBe('"content"');
    });

    it('returns zero as a string', () => {
      expect(formatValue('padding', 0, {}, engine)).toBe('0');
    });

    it('doesnt add a default suffix if a unitless number', () => {
      expect(formatValue('line-height', 10, {}, engine)).toBe('10');
    });

    it('adds default suffix if a non-unitless number', () => {
      expect(formatValue('padding', 10, {}, engine)).toBe('10px');
    });

    it('can customize unit suffix with render option', () => {
      expect(formatValue('padding', 10, { unit: 'em' }, engine)).toBe('10em');
    });

    it('can customize unit suffix with unit suffixer option', () => {
      engine.unitSuffixer = 'em';

      expect(formatValue('padding', 10, {}, engine)).toBe('10em');
    });

    it('can customize unit suffix with unit suffixer function', () => {
      engine.unitSuffixer = (prop) => {
        if (prop === 'padding') {
          return 'rem';
        }

        return 'em';
      };

      expect(formatValue('padding', 10, {}, engine)).toBe('10rem');
    });
  });

  describe('formatVariable()', () => {
    it('returns as-is if formatted correctly', () => {
      expect(formatVariable('--foo')).toBe('--foo');
      expect(formatVariable('--foo-bar')).toBe('--foo-bar');
    });

    it('adds leading dashes if not provided', () => {
      expect(formatVariable('foo')).toBe('--foo');
    });

    it('hyphenates if in camel case', () => {
      expect(formatVariable('fooBar')).toBe('--foo-bar');
      expect(formatVariable('--fooBar')).toBe('--foo-bar');
    });
  });

  describe('formatVariableBlock()', () => {
    it('returns a block of formatted variables', () => {
      expect(
        formatVariableBlock({
          foo: 'abc',
          barBaz: 123,
          '--var': '10px',
          '--var-dashed': 0,
          '--camelDashed': '100',
        }),
      ).toBe('--foo:abc;--bar-baz:123;--var:10px;--var-dashed:0;--camel-dashed:100;');
    });
  });
});
