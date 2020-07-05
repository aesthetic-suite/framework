/* eslint-disable lines-between-class-members, no-dupe-class-members */

import { Property, Value, Variables } from '@aesthetic/types';
import { isObject, toArray, arrayLoop, objectLoop, hyphenate } from '@aesthetic/utils';
import Block from './Block';
import formatFontFace from './helpers/formatFontFace';
import processCompoundProperty from './helpers/processCompoundProperty';
import processExpandedProperty from './helpers/processExpandedProperty';
import { expandedProperties } from './properties';
import { COMPOUND_PROPERTIES, EXPANDED_PROPERTIES } from './constants';
import {
  BlockConditionListener,
  BlockListener,
  BlockNestedListener,
  BlockPropertyListener,
  ClassNameListener,
  FallbackProperties,
  FontFace,
  FontFaceListener,
  ImportListener,
  Keyframes,
  KeyframesListener,
  LocalBlock,
  Properties,
  Rule,
  RuleListener,
  VariableListener,
  ProcessorMap,
} from './types';

export const SELECTOR = /^((\[[a-z-]+\])|(::?[a-z-]+))$/iu;

// Any is required for method overloading to work
export type Handler = (...args: any[]) => void;

export interface HandlerMap {
  [eventName: string]: Handler;
}

export interface CommonEvents<T extends object> {
  onBlock?: BlockListener<T>;
  onBlockAttribute?: BlockNestedListener<T>;
  onBlockFallback?: BlockPropertyListener<T>;
  onBlockMedia?: BlockConditionListener<T>;
  onBlockProperty?: BlockPropertyListener<T>;
  onBlockPseudo?: BlockNestedListener<T>;
  onBlockSelector?: BlockNestedListener<T>;
  onBlockSupports?: BlockConditionListener<T>;
  onBlockVariable?: BlockPropertyListener<T>;
  onBlockVariant?: BlockNestedListener<T>;
  onFontFace?: FontFaceListener<T>;
  onKeyframes?: KeyframesListener<T>;
  onVariable?: VariableListener;
}

const EVENT_MAP = {
  onBlockAttribute: 'block:attribute',
  onBlockFallback: 'block:fallback',
  onBlockMedia: 'block:media',
  onBlockProperty: 'block:property',
  onBlockPseudo: 'block:pseudo',
  onBlockSelector: 'block:selector',
  onBlockSupports: 'block:supports',
  onBlockVariable: 'block:variable',
  onBlockVariant: 'block:variant',
  onFontFace: 'font-face',
};

export default abstract class Parser<T extends object, E extends object> {
  protected handlers: HandlerMap = {};

  constructor(handlers?: E) {
    if (handlers) {
      objectLoop(handlers, (handler, name) => {
        this.on(
          (EVENT_MAP[name as keyof typeof EVENT_MAP] || name.slice(2).toLowerCase()) as 'block',
          (handler as unknown) as Handler,
        );
      });
    }
  }

  parseBlock(parent: Block<T>, object: Rule): Block<T> {
    this.validateDeclarationBlock(object, parent.selector);

    objectLoop(object, (value, key) => {
      if (value === undefined) {
        return;
      }

      const char = key.charAt(0);

      // Pseudo and attribute selectors
      if (char === ':' || char === '[') {
        this.parseSelector(parent, key, value as Rule);

        // Special case for unique at-rules (@page blocks)
      } else if (char === '@') {
        parent.addNested(this.parseBlock(new Block(key), value as Rule));

        // Run for each property so it can be customized
      } else {
        this.parseProperty(parent, key as Property, value);
      }
    });

    this.emit('block', parent);

    return parent;
  }

  parseConditionalBlock(
    parent: Block<T>,
    conditions: { [key: string]: LocalBlock },
    type: 'media' | 'supports',
  ) {
    this.validateDeclarations(conditions, `@${type}`);

    objectLoop(conditions, (object, condition) => {
      const nestedBlock = this.parseLocalBlock(new Block(`@${type} ${condition}`), object);

      parent.addNested(nestedBlock);

      this.emit(`block:${type}` as 'block:media', parent, condition, nestedBlock);
    });
  }

  parseFallbackProperties(parent: Block<T>, fallbacks: FallbackProperties) {
    this.validateDeclarationBlock(fallbacks, '@fallbacks');

    objectLoop(fallbacks, (value, prop) => {
      this.emit('block:fallback', parent, prop, toArray(value));
    });
  }

  parseFontFace = (object: FontFace, fontFamily?: string): string => {
    const name = object.fontFamily || fontFamily || '';

    this.validateDeclarationBlock(object, name);

    const fontFace = formatFontFace({
      ...object,
      fontFamily: name,
    }) as Properties;

    // Inherit the name from the listener as it may be generated
    return this.emit(
      'font-face',
      this.parseBlock(new Block('@font-face'), fontFace),
      name,
      object.srcPaths,
    );
  };

  parseKeyframes = (object: Keyframes, animationName?: string): string => {
    const keyframes = new Block<T>(`@keyframes`);

    this.validateDeclarationBlock(object, keyframes.selector);

    // from, to, and percent keys aren't easily detectable
    objectLoop(object, (value, key) => {
      if (value !== undefined) {
        keyframes.addNested(this.parseBlock(new Block(key), value));
      }
    });

    // Inherit the name from the listener as it may be generated
    return this.emit('keyframes', keyframes, animationName) || animationName || '';
  };

  parseLocalBlock(parent: Block<T>, object: LocalBlock): Block<T> {
    this.validateDeclarationBlock(object, parent.selector);

    const props = { ...object };

    if (props['@fallbacks']) {
      this.parseFallbackProperties(parent, props['@fallbacks']);

      delete props['@fallbacks'];
    }

    if (props['@media']) {
      this.parseConditionalBlock(parent, props['@media'], 'media');

      delete props['@media'];
    }

    if (props['@selectors']) {
      this.validateDeclarations(props['@selectors'], '@selectors');

      objectLoop(props['@selectors'], (value, key) => {
        this.parseSelector(parent, key, value, true);
      });

      delete props['@selectors'];
    }

    if (props['@supports']) {
      this.parseConditionalBlock(parent, props['@supports'], 'supports');

      delete props['@supports'];
    }

    if (props['@variables']) {
      this.parseVariables(parent, props['@variables']);

      delete props['@variables'];
    }

    if (props['@variants']) {
      this.parseVariants(parent, props['@variants']);

      delete props['@variants'];
    }

    return this.parseBlock(parent, props);
  }

  parseProperty(parent: Block<T>, name: Property, value: unknown) {
    const handler = (n: Property, v: Value) => {
      parent.addProperty(n, v);

      this.emit('block:property', parent, n, v);
    };

    // Convert expanded properties to longhand
    if (EXPANDED_PROPERTIES.has(name) && isObject(value)) {
      processExpandedProperty(name, value, expandedProperties[name], handler);

      return;
    }

    // Convert compound properties
    if (COMPOUND_PROPERTIES.has(name) && (isObject(value) || Array.isArray(value))) {
      const compoundProperties: ProcessorMap = {
        animationName: (prop: Keyframes) => this.parseKeyframes(prop),
        fontFamily: (prop: FontFace) => this.parseFontFace(prop),
      };

      processCompoundProperty(name, value, compoundProperties[name], handler);

      return;
    }

    // Normal property
    if (typeof value === 'number' || typeof value === 'string') {
      handler(name, value);
    }
  }

  parseSelector(parent: Block<T>, selector: string, object: Rule, inAtRule: boolean = false) {
    this.validateDeclarationBlock(object, selector);

    if (__DEV__) {
      if ((selector.includes(',') || !selector.match(SELECTOR)) && !inAtRule) {
        throw new Error(
          `Advanced selector "${selector}" must be nested within a @selectors block.`,
        );
      }
    }

    const block = this.parseLocalBlock(new Block(selector), object);

    arrayLoop(selector.split(','), (k) => {
      let name = k.trim();
      let type = 'block:selector';
      let specificity = 0;

      // Capture specificity
      while (name.charAt(0) === '&') {
        specificity += 1;
        name = name.slice(1);
      }

      if (name.charAt(0) === ':') {
        type = 'block:pseudo';
      } else if (name.charAt(0) === '[') {
        type = 'block:attribute';
      }

      const nestedBlock = block.clone(name);

      parent.addNested(nestedBlock);

      this.emit(type as 'block:selector', parent, name, nestedBlock, { specificity });
    });
  }

  parseVariables(parent: Block<T> | null, variables: Variables) {
    this.validateDeclarations(variables, '@variables');

    objectLoop(variables, (value, prop) => {
      let name = hyphenate(prop);

      if (name.slice(0, 2) !== '--') {
        name = `--${name}`;
      }

      if (parent) {
        parent.addVariable(name, value);

        this.emit('block:variable', parent, name, value);
      } else {
        this.emit('variable', name, value);
      }
    });
  }

  parseVariants(parent: Block<T>, variants: { [key: string]: LocalBlock }) {
    this.validateDeclarations(variants, '@variants');

    objectLoop(variants, (object, type) => {
      this.emit(
        'block:variant',
        parent,
        type,
        this.parseLocalBlock(new Block(`@variants ${type}`), object),
        { specificity: 0 },
      );
    });
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector' | 'block:variant',
    ...args: Parameters<BlockNestedListener<T>>
  ): void;
  emit(
    name: 'block:fallback' | 'block:property' | 'block:variable',
    ...args: Parameters<BlockPropertyListener<T>>
  ): void;
  emit(
    name: 'block:media' | 'block:supports',
    ...args: Parameters<BlockConditionListener<T>>
  ): void;
  emit(name: 'block' | 'global' | 'page' | 'viewport', ...args: Parameters<BlockListener<T>>): void;
  emit(name: 'class', ...args: Parameters<ClassNameListener>): void;
  emit(name: 'font-face', ...args: Parameters<FontFaceListener<T>>): string;
  emit(name: 'import', ...args: Parameters<ImportListener>): void;
  emit(name: 'keyframes', ...args: Parameters<KeyframesListener<T>>): string;
  emit(name: 'rule', ...args: Parameters<RuleListener<T>>): void;
  emit(name: 'variable', ...args: Parameters<VariableListener>): void;
  emit(name: string, ...args: unknown[]): unknown {
    return this.handlers[name]?.(...args);
  }

  /**
   * Register an event listener.
   */
  on(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector' | 'block:variant',
    callback: BlockNestedListener<T>,
  ): this;
  on(name: 'block:media' | 'block:supports', callback: BlockConditionListener<T>): this;
  on(
    name: 'block:fallback' | 'block:property' | 'block:variable',
    callback: BlockPropertyListener<T>,
  ): this;
  on(name: 'block' | 'global' | 'page' | 'viewport', callback: BlockListener<T>): this;
  on(name: 'class', callback: ClassNameListener): this;
  on(name: 'font-face', callback: FontFaceListener<T>): this;
  on(name: 'import', callback: ImportListener): this;
  on(name: 'keyframes', callback: KeyframesListener<T>): this;
  on(name: 'rule', callback: RuleListener<T>): this;
  on(name: 'variable', callback: VariableListener): this;
  on(name: string, callback: Handler): this {
    this.handlers[name] = callback;

    return this;
  }

  protected validateDeclarationBlock(block: unknown, name: string): block is object {
    if (__DEV__) {
      if (!isObject(block)) {
        throw new TypeError(`"${name}" must be a declaration object of CSS properties.`);
      }
    }

    return true;
  }

  protected validateDeclarations(block: unknown, name: string): block is object {
    if (__DEV__) {
      if (!isObject(block)) {
        throw new Error(
          `${name} must be a mapping of CSS ${
            name === '@variables' ? 'variables' : 'declarations'
          }.`,
        );
      }
    }

    return true;
  }
}
