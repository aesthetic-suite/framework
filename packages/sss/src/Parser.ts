/* eslint-disable lines-between-class-members, no-dupe-class-members */

import { isObject, toArray, arrayLoop, objectLoop, hyphenate } from '@aesthetic/utils';
import Block from './Block';
import formatFontFace from './formatFontFace';
import isUnitlessProperty from './isUnitlessProperty';
import propertyTransformers from './properties';
import {
  BlockConditionListener,
  BlockListener,
  BlockNestedListener,
  BlockPropertyListener,
  ClassNameListener,
  CSSVariables,
  DeclarationBlock,
  FallbackProperties,
  FontFace,
  FontFaceListener,
  ImportListener,
  Keyframes,
  KeyframesListener,
  LocalBlock,
  ParserOptions,
  Properties,
  RulesetListener,
  Value,
  VariableListener,
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
  onFontFace: 'font-face',
};

export default abstract class Parser<T extends object, E extends object> {
  protected handlers: HandlerMap = {};

  protected options: Required<ParserOptions> = {
    unit: 'px',
  };

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

  parseBlock(parent: Block<T>, object: DeclarationBlock): Block<T> {
    this.validateDeclarationBlock(object, parent.selector);

    objectLoop(object, (value, key) => {
      if (value === undefined) {
        return;
      }

      const char = key.charAt(0);

      // Pseudo and attribute selectors
      if (char === ':' || char === '[') {
        this.parseSelector(parent, key, value as DeclarationBlock);

        // Special case for unique at-rules (@page blocks)
      } else if (char === '@') {
        parent.addNested(this.parseBlock(new Block(key), value as DeclarationBlock));

        // Run for each property so it can be customized
      } else {
        const nextValue = this.transformProperty(key as keyof Properties, value)!;

        parent.addProperty(key, nextValue);

        this.emit('block:property', parent, key, nextValue);
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

  parseFontFace = (fontFamily: string, object: FontFace): string => {
    const name = object.fontFamily || fontFamily;

    if (__DEV__) {
      if (!name) {
        throw new Error(`@font-face requires a font family name.`);
      }
    }

    this.validateDeclarationBlock(object, `@font-face ${name}`);

    const fontFace = formatFontFace({
      ...object,
      fontFamily: name,
    }) as Properties;

    this.emit(
      'font-face',
      this.parseBlock(new Block('@font-face'), fontFace),
      name,
      object.srcPaths,
    );

    return name;
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
    return this.emit('keyframes', keyframes, animationName) || animationName!;
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

    return this.parseBlock(parent, props);
  }

  parseSelector(
    parent: Block<T>,
    selector: string,
    object: DeclarationBlock,
    inAtRule: boolean = false,
  ) {
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

  parseVariables(parent: Block<T> | null, variables: CSSVariables) {
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

  transformProperty<K extends keyof Properties>(key: K, value: unknown): Value | undefined {
    if (value === undefined) {
      return undefined;
    }

    const prop = key as keyof typeof propertyTransformers;

    if (prop === 'animationName') {
      return propertyTransformers.animationName(
        value as Keyframes,
        this.wrapValueWithUnit,
        (keyframes) => this.parseKeyframes(keyframes),
      );
    }

    if (prop === 'fontFamily') {
      return propertyTransformers.fontFamily(
        value as FontFace,
        this.wrapValueWithUnit,
        (fontFace) => this.parseFontFace(fontFace.fontFamily!, fontFace),
      );
    }

    if (propertyTransformers[prop]) {
      return propertyTransformers[prop](value as Value, this.wrapValueWithUnit);
    }

    return this.wrapValueWithUnit(key, value);
  }

  wrapValueWithUnit = (property: string, value: unknown): Value => {
    if (value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (isUnitlessProperty(property) || value === 0) {
      return Number(value);
    }

    return value + this.options.unit;
  };

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector',
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
  emit(name: 'font-face', ...args: Parameters<FontFaceListener<T>>): void;
  emit(name: 'import', ...args: Parameters<ImportListener>): void;
  emit(name: 'keyframes', ...args: Parameters<KeyframesListener<T>>): string;
  emit(name: 'ruleset', ...args: Parameters<RulesetListener<T>>): void;
  emit(name: 'variable', ...args: Parameters<VariableListener>): void;
  emit(name: string, ...args: unknown[]): unknown {
    return this.handlers[name]?.(...args);
  }

  /**
   * Register an event listener.
   */
  on(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector',
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
  on(name: 'ruleset', callback: RulesetListener<T>): this;
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
