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
} from './__mocks__/local';

describe('LocalParser', () => {
  let parser: LocalParser<Properties>;
  let spy: jest.Mock;

  beforeEach(() => {
    parser = new LocalParser({
      onBlockProperty(block, key, value) {
        block.addProperty(key as keyof Properties, value);
      },
    });

    spy = jest.fn();
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

  describe('@fallbacks', () => {
    beforeEach(() => {
      parser.on('block:fallback', spy);
    });

    it('errors if fallbacks are not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          fb: {
            '@fallbacks': 123,
          },
        });
      }).toThrow('@fallbacks must be an object of property names to fallback values.');
    });

    it('does not emit if no fallbacks', () => {
      parser.parse({});

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

  describe('@selectors', () => {
    beforeEach(() => {
      parser.on('block:selector', spy);
    });

    it('errors if selectors are not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          fb: {
            '@selectors': 123,
          },
        });
      }).toThrow('@selectors must be an object of CSS selectors to property declarations.');
    });

    it('does not emit if no selectors', () => {
      parser.parse({});

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
});
