import LocalParser from '../src/LocalParser';
import Block from '../src/Block';
import { Properties } from '../src/types';
import { createBlock } from './helpers';
import {
  SYNTAX_FALLBACKS,
  SYNTAX_PROPERTIES,
  SYNTAX_SELECTOR_ATTRIBUTES,
  SYNTAX_SELECTOR_PSEUDOS,
  SYNTAX_SELECTORS_SPECIFICITY,
  SYNTAX_SELECTORS_COMBINATORS,
  SYNTAX_SELECTORS_MULTIPLE,
  SYNTAX_SUPPORTS,
  SYNTAX_MEDIA,
  SYNTAX_MEDIA_NESTED,
} from './__mocks__/local';

describe('LocalParser', () => {
  let parser: LocalParser<Properties>;
  let spy: jest.Mock;

  beforeEach(() => {
    parser = new LocalParser();
    spy = jest.fn();
  });

  it('errors for an at-rule', () => {
    expect(() => {
      parser.parse({
        '@rule': {},
      });
    }).toThrow('At-rules may not be defined at the root of a local block, found "@rule".');
  });

  it('errors for invalid value type', () => {
    expect(() => {
      parser.parse({
        // @ts-ignore Allow invalid type
        el: 123,
      });
    }).toThrow(
      'Invalid declaration for "el". Must be an object (style declaration) or string (class name).',
    );
  });

  describe('class names', () => {
    beforeEach(() => {
      parser.on('class', spy);
    });

    it('emits for each class name', () => {
      parser.parse({
        foo: 'foo',
        bar: {},
        baz: 'baz',
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('foo', 'foo');
      expect(spy).toHaveBeenCalledWith('baz', 'baz');
    });
  });

  describe('properties', () => {
    beforeEach(() => {
      parser.on('block:property', spy);
    });

    it('emits each property and value', () => {
      parser.parse({
        props: SYNTAX_PROPERTIES,
      });

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'color', 'black');
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'display', 'inline');
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'marginRight', 10);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', 0);
    });

    it('doesnt emit for undefined values', () => {
      parser.parse({
        props: {
          color: undefined,
        },
      });

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('attributes', () => {
    beforeEach(() => {
      parser.on('block:attribute', spy);
    });

    it('emits each attribute with value and params', () => {
      parser.parse({
        attrs: SYNTAX_SELECTOR_ATTRIBUTES,
      });

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '[disabled]',
        createBlock('[disabled]', SYNTAX_SELECTOR_ATTRIBUTES['[disabled]']),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '[href]',
        createBlock('[href]', SYNTAX_SELECTOR_ATTRIBUTES['[href]']),
        { specificity: 0 },
      );
    });
  });

  describe('pseudos', () => {
    beforeEach(() => {
      parser.on('block:pseudo', spy);
    });

    it('emits each pseudo (class and element) with value and params', () => {
      parser.parse({
        attrs: SYNTAX_SELECTOR_PSEUDOS,
      });

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        ':hover',
        createBlock(':hover', SYNTAX_SELECTOR_PSEUDOS[':hover']),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '::before',
        createBlock('::before', SYNTAX_SELECTOR_PSEUDOS['::before']),
        { specificity: 0 },
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      parser.on('block:selector', spy);
    });

    it('errors if selector is not an object', () => {
      expect(() => {
        parser.parse({
          selector: {
            // @ts-ignore Allow invalid type
            ':hover': 123,
          },
        });
      }).toThrow('":hover" must be a declaration object of CSS properties.');
    });

    it('errors if a comma separated list is passed', () => {
      expect(() => {
        parser.parse({
          selector: {
            // @ts-ignore Allow invalid type
            ':hover, :focus': {},
          },
        });
      }).toThrow('Advanced selector ":hover, :focus" must be nested within a @selectors block.');
    });
  });

  describe('@fallbacks', () => {
    beforeEach(() => {
      parser.on('block:fallback', spy);
    });

    it('errors if fallbacks are not an object', () => {
      expect(() => {
        parser.parse({
          fb: {
            // @ts-ignore Allow invalid type
            '@fallbacks': 123,
          },
        });
      }).toThrow('"@fallback" must be a declaration object of CSS properties.');
    });

    it('does not emit if no fallbacks', () => {
      parser.parse({
        fb: {},
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits for each fallback declaration', () => {
      parser.parse({
        fb: SYNTAX_FALLBACKS,
      });

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'background', ['red']);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'display', ['block', 'inline-block']);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'color', ['blue']);
    });
  });

  describe('@media', () => {
    beforeEach(() => {
      parser.on('block:media', spy);
    });

    it('errors if media is not an object', () => {
      expect(() => {
        parser.parse({
          fb: {
            // @ts-ignore Allow invalid type
            '@media': 123,
          },
        });
      }).toThrow('@media must be a mapping of CSS declarations.');
    });

    it('does not emit if no media', () => {
      parser.parse({
        media: {},
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits for each condition', () => {
      parser.parse({
        media: SYNTAX_MEDIA,
      });

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '(min-width: 300px)',
        createBlock('@media (min-width: 300px)', {
          color: 'blue',
          paddingLeft: 15,
        }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '(max-width: 1000px)',
        createBlock('@media (max-width: 1000px)', {
          color: 'green',
          paddingLeft: 20,
        }),
      );
    });

    it('supports nested media conditions', () => {
      parser.parse({
        media: SYNTAX_MEDIA_NESTED,
      });

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '(min-width: 300px)',
        createBlock('@media (min-width: 300px)', {
          color: 'blue',
          '@media (max-width: 1000px)': {
            color: 'green',
          },
        }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '(max-width: 1000px)',
        createBlock('@media (max-width: 1000px)', {
          color: 'green',
        }),
      );
    });
  });

  describe('@selectors', () => {
    beforeEach(() => {
      parser.on('block:selector', spy);
    });

    it('errors if selectors are not an object', () => {
      expect(() => {
        parser.parse({
          fb: {
            // @ts-ignore Allow invalid type
            '@selectors': 123,
          },
        });
      }).toThrow('@selectors must be a mapping of CSS declarations.');
    });

    it('does not emit if no selectors', () => {
      parser.parse({
        selectors: {},
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits selector with defined specificity', () => {
      const attrSpy = jest.fn();
      const pseudoSpy = jest.fn();

      parser.on('block:attribute', attrSpy);
      parser.on('block:pseudo', pseudoSpy);
      parser.parse({
        selectors: SYNTAX_SELECTORS_SPECIFICITY,
      });

      expect(pseudoSpy).toHaveBeenCalledTimes(2);

      expect(pseudoSpy).toHaveBeenCalledWith(
        expect.any(Block),
        ':hover',
        createBlock(':hover', { position: 'static' }),
        { specificity: 2 },
      );

      expect(pseudoSpy).toHaveBeenCalledWith(
        expect.any(Block),
        ':active',
        createBlock(':active', { position: 'absolute' }),
        { specificity: 1 },
      );

      expect(attrSpy).toHaveBeenCalledTimes(1);

      expect(attrSpy).toHaveBeenCalledWith(
        expect.any(Block),
        '[hidden]',
        createBlock('[hidden]', { position: 'relative' }),
        { specificity: 3 },
      );
    });

    it('emits universal and combinator selectors', () => {
      parser.parse({
        selectors: SYNTAX_SELECTORS_COMBINATORS,
      });

      expect(spy).toHaveBeenCalledTimes(4);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '> li',
        createBlock('> li', { listStyle: 'bullet' }),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '+ div',
        createBlock('+ div', { display: 'none' }),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '~ span',
        createBlock('~ span', { color: 'black' }),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '*',
        createBlock('*', { backgroundColor: 'inherit' }),
        { specificity: 0 },
      );
    });

    it('emits each selector in a comma separated list', () => {
      const attrSpy = jest.fn();
      const pseudoSpy = jest.fn();

      parser.on('block:attribute', attrSpy);
      parser.on('block:pseudo', pseudoSpy);
      parser.parse({
        selectors: SYNTAX_SELECTORS_MULTIPLE,
      });

      expect(pseudoSpy).toHaveBeenCalledWith(
        expect.any(Block),
        ':disabled',
        createBlock(':disabled', { cursor: 'default' }),
        { specificity: 0 },
      );

      expect(attrSpy).toHaveBeenCalledWith(
        expect.any(Block),
        '[disabled]',
        createBlock('[disabled]', { cursor: 'default' }),
        { specificity: 2 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '> span',
        createBlock('> span', { cursor: 'default' }),
        { specificity: 0 },
      );
    });
  });

  describe('@supports', () => {
    beforeEach(() => {
      parser.on('block:supports', spy);
    });

    it('errors if supports are not an object', () => {
      expect(() => {
        parser.parse({
          fb: {
            // @ts-ignore Allow invalid type
            '@supports': 123,
          },
        });
      }).toThrow('@supports must be a mapping of CSS declarations.');
    });

    it('does not emit if no supports', () => {
      parser.parse({
        supports: {},
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits for each condition', () => {
      parser.parse({
        supports: SYNTAX_SUPPORTS,
      });

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '(display: flex)',
        createBlock('@supports (display: flex)', { display: 'flex' }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        'not (display: flex)',
        createBlock('@supports not (display: flex)', { float: 'left' }),
      );
    });
  });
});
