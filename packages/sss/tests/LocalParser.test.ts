import Block from '../src/Block';
import doParse from '../src/parse';
import { LocalStyleSheet, ParserOptions } from '../src/types';
import {
  SYNTAX_COMPOUND_VARIANTS,
  SYNTAX_FALLBACKS,
  SYNTAX_LOCAL_BLOCK,
  SYNTAX_MEDIA,
  SYNTAX_MEDIA_NESTED,
  SYNTAX_NATIVE_PROPERTIES,
  SYNTAX_PROPERTIES,
  SYNTAX_SELECTOR_ATTRIBUTES,
  SYNTAX_SELECTOR_PSEUDOS,
  SYNTAX_SELECTORS_COMBINATORS,
  SYNTAX_SELECTORS_MULTIPLE,
  SYNTAX_SELECTORS_SPECIFICITY,
  SYNTAX_SUPPORTS,
  SYNTAX_VARIABLES,
  SYNTAX_VARIANTS,
} from './__mocks__/local';
import { createBlock, createExpectedBlock } from './helpers';

function parse(styleSheet: LocalStyleSheet, options: Partial<ParserOptions<object>>) {
  doParse('local', styleSheet, options);
}

describe('LocalParser', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
  });

  it('errors for an at-rule', () => {
    expect(() => {
      parse(
        {
          '@rule': {},
        },
        {},
      );
    }).toThrow('At-rules may not be defined at the root of a local block, found "@rule".');
  });

  it('errors for invalid value type', () => {
    expect(() => {
      parse(
        {
          // @ts-expect-error
          el: 123,
        },
        {},
      );
    }).toThrow(
      'Invalid declaration for "el". Must be an object (style declaration) or string (class name).',
    );
  });

  it('renders a full block', () => {
    parse(
      {
        selector: SYNTAX_LOCAL_BLOCK,
      },
      {
        onRule: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith('selector', createBlock('selector', SYNTAX_LOCAL_BLOCK));
  });

  describe('class names', () => {
    it('emits for each class name', () => {
      parse(
        {
          foo: 'foo',
          bar: {},
          baz: 'baz',
        },
        {
          onClass: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('foo', 'foo');
      expect(spy).toHaveBeenCalledWith('baz', 'baz');
    });
  });

  describe('properties', () => {
    it('emits each property and value', () => {
      parse(
        {
          props: SYNTAX_PROPERTIES,
        },
        {
          onProperty: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'color', 'black');
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'display', 'inline');
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'marginRight', 10);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', 0);
    });

    it('emits for non-primitive property values (react native)', () => {
      parse(
        {
          props: SYNTAX_NATIVE_PROPERTIES,
        },
        {
          onProperty: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'transform', [{ scale: 2 }]);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'shadowOffset', {
        width: 10,
        height: 10,
      });
    });

    it('doesnt emit for undefined values', () => {
      parse(
        {
          props: {
            color: undefined,
          },
        },
        {
          onProperty: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('@fallbacks', () => {
    it('errors if fallbacks are not an object', () => {
      expect(() => {
        parse(
          {
            fb: {
              // @ts-expect-error
              '@fallbacks': 123,
            },
          },
          {},
        );
      }).toThrow('"@fallbacks" must be a declaration object of CSS properties.');
    });

    it('does not emit if no fallbacks', () => {
      parse(
        {
          fb: {},
        },
        {
          onFallback: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits for each fallback declaration that has a base property', () => {
      parse(
        {
          fb: SYNTAX_FALLBACKS,
        },
        {
          onFallback: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'background', ['red']);
      expect(spy).toHaveBeenCalledWith(expect.any(Block), 'display', ['block', 'inline-block']);
    });
  });

  describe('@selectors', () => {
    it('errors if selectors are not an object', () => {
      expect(() => {
        parse(
          {
            fb: {
              // @ts-expect-error
              '@selectors': 123,
            },
          },
          {},
        );
      }).toThrow('@selectors must be a mapping of CSS declarations.');
    });

    it('does not emit if no selectors', () => {
      parse(
        {
          selectors: {},
        },
        {
          onSelector: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits selector with defined specificity', () => {
      const attrSpy = jest.fn();
      const pseudoSpy = jest.fn();

      parse(
        {
          selectors: SYNTAX_SELECTORS_SPECIFICITY,
        },
        {
          onAttribute: attrSpy,
          onPseudo: pseudoSpy,
        },
      );

      expect(pseudoSpy).toHaveBeenCalledTimes(2);

      expect(pseudoSpy).toHaveBeenCalledWith(
        expect.any(Block),
        ':hover',
        createExpectedBlock(':hover', { position: 'static' }),
        { specificity: 2 },
      );

      expect(pseudoSpy).toHaveBeenCalledWith(
        expect.any(Block),
        ':active',
        createExpectedBlock(':active', { position: 'absolute' }),
        { specificity: 1 },
      );

      expect(attrSpy).toHaveBeenCalledTimes(1);

      expect(attrSpy).toHaveBeenCalledWith(
        expect.any(Block),
        '[hidden]',
        createExpectedBlock('[hidden]', { position: 'relative' }),
        { specificity: 3 },
      );
    });

    it('emits universal and combinator selectors', () => {
      parse(
        {
          selectors: SYNTAX_SELECTORS_COMBINATORS,
        },
        {
          onSelector: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(4);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '> li',
        createExpectedBlock('> li', { listStyle: 'bullet' }),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '+ div',
        createExpectedBlock('+ div', { display: 'none' }),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '~ span',
        createExpectedBlock('~ span', { color: 'black' }),
        { specificity: 0 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '*',
        createExpectedBlock('*', { backgroundColor: 'inherit' }),
        { specificity: 0 },
      );
    });

    it('emits each selector in a comma separated list', () => {
      const attrSpy = jest.fn();
      const pseudoSpy = jest.fn();

      parse(
        {
          selectors: SYNTAX_SELECTORS_MULTIPLE,
        },
        {
          onAttribute: attrSpy,
          onPseudo: pseudoSpy,
          onSelector: spy,
        },
      );

      expect(pseudoSpy).toHaveBeenCalledWith(
        expect.any(Block),
        ':disabled',
        createExpectedBlock(':disabled', { cursor: 'default' }),
        { specificity: 0 },
      );

      expect(attrSpy).toHaveBeenCalledWith(
        expect.any(Block),
        '[disabled]',
        createExpectedBlock('[disabled]', { cursor: 'default' }),
        { specificity: 2 },
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Block),
        '> span',
        createExpectedBlock('> span', { cursor: 'default' }),
        { specificity: 0 },
      );
    });
  });
});
