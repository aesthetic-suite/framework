/* eslint-disable lines-between-class-members, no-dupe-class-members */

import { isObject, toArray, arrayLoop, objectLoop } from '@aesthetic/utils';
import Block from './Block';
import formatFontFace from './formatFontFace';
import isUnitlessProperty from './isUnitlessProperty';
import compoundProperties from './compound';
import expandedProperties from './expanded';
import {
  BlockConditionListener,
  BlockListener,
  BlockNestedListener,
  BlockPropertyListener,
  DeclarationBlock,
  FallbackProperties,
  FontFace,
  FontFaceListener,
  ImportListener,
  Keyframes,
  KeyframesListener,
  LocalBlock,
  Properties,
  RulesetListener,
  ClassNameListener,
  ParserOptions,
  Length,
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
  onFontFace?: FontFaceListener<T>;
  onKeyframes?: KeyframesListener<T>;
}

const EVENT_MAP = {
  onBlockAttribute: 'block:attribute',
  onBlockFallback: 'block:fallback',
  onBlockMedia: 'block:media',
  onBlockProperty: 'block:property',
  onBlockPseudo: 'block:pseudo',
  onBlockSelector: 'block:selector',
  onBlockSupports: 'block:supports',
  onFontFace: 'font-face',
};

export default abstract class Parser<T extends object, E extends object> {
  protected handlers: HandlerMap = {};

  protected options: Required<ParserOptions> = {
    unit: 'px',
  };

  constructor(handlers?: E, options?: ParserOptions) {
    if (handlers) {
      objectLoop(handlers, (handler, name) => {
        this.on(
          (EVENT_MAP[name as keyof typeof EVENT_MAP] || name.slice(2).toLowerCase()) as 'block',
          (handler as unknown) as Handler,
        );
      });
    }

    if (options) {
      Object.assign(this.options, options);
    }
  }

  applyUnitToValue = (property: string, value: unknown) => {
    if (value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (isUnitlessProperty(property) || value === 0) {
      return String(value);
    }

    return value + this.options.unit;
  };

  parseBlock(builder: Block<T>, object: DeclarationBlock): Block<T> {
    if (__DEV__) {
      if (!isObject(object)) {
        throw new TypeError(`Block "${builder.selector}" must be an object of properties.`);
      }
    }

    objectLoop(object, (value, key) => {
      if (value === undefined) {
        return;
      }

      const char = key.charAt(0);

      // Pseudo and attribute selectors
      if (char === ':' || char === '[') {
        this.parseSelector(builder, key, value as DeclarationBlock);

        // Special case for unique at-rules (@page blocks)
      } else if (char === '@') {
        builder.addNested(this.parseBlock(new Block(key), value as DeclarationBlock));

        // Run for each property so it can be customized
      } else {
        const nextValue = this.transformProperty(key, value);

        builder.addProperty(key as keyof T, nextValue as T[keyof T]);

        this.emit('block:property', builder, key, nextValue);
      }
    });

    this.emit('block', builder);

    return builder;
  }

  parseConditionalBlock(
    builder: Block<T>,
    object: { [key: string]: LocalBlock },
    type: 'media' | 'supports',
  ) {
    if (__DEV__) {
      if (!isObject(object)) {
        throw new Error(`@${type} must be an object of conditions to declarations.`);
      }
    }

    objectLoop(object, (block, query) => {
      const nestedBlock = this.parseLocalBlock(new Block(`@${type} ${query}`), block);

      builder.addNested(nestedBlock);

      this.emit(`block:${type}` as 'block:media', builder, query, nestedBlock);
    });
  }

  parseFallbackProperties(builder: Block<T>, fallbacks: FallbackProperties) {
    if (__DEV__) {
      if (!isObject(fallbacks)) {
        throw new Error('@fallbacks must be an object of property names to fallback values.');
      }
    }

    objectLoop(fallbacks, (value, prop) => {
      this.emit('block:fallback', builder, prop, toArray(value));
    });
  }

  parseFontFace(fontFamily: string, object: FontFace): string {
    const fontFace = formatFontFace({
      ...object,
      fontFamily,
    }) as Properties;

    this.emit(
      'font-face',
      this.parseBlock(new Block('@font-face'), fontFace),
      fontFamily,
      object.srcPaths,
    );

    return fontFamily;
  }

  parseKeyframesAnimation(animationName: string, object: Keyframes): string {
    const name = object.name || animationName;
    const keyframes = new Block<T>(`@keyframes ${name}`);

    // from, to, and percent keys aren't easily detectable
    objectLoop(object, (value, key) => {
      if (key === 'name' || value === undefined) {
        return;
      }

      if (typeof value !== 'string') {
        keyframes.addNested(this.parseBlock(new Block(key), value));
      }
    });

    this.emit('keyframes', keyframes, name);

    return name;
  }

  parseLocalBlock(builder: Block<T>, object: LocalBlock): Block<T> {
    const props = { ...object };

    if (props['@fallbacks']) {
      this.parseFallbackProperties(builder, props['@fallbacks']);

      delete props['@fallbacks'];
    }

    if (props['@media']) {
      this.parseConditionalBlock(builder, props['@media'], 'media');

      delete props['@media'];
    }

    if (props['@selectors']) {
      if (__DEV__) {
        if (!isObject(props['@selectors'])) {
          throw new Error(
            '@selectors must be an object of CSS selectors to property declarations.',
          );
        }
      }

      objectLoop(props['@selectors'], (value, key) => {
        this.parseSelector(builder, key, value, true);
      });

      delete props['@selectors'];
    }

    if (props['@supports']) {
      this.parseConditionalBlock(builder, props['@supports'], 'supports');

      delete props['@supports'];
    }

    return this.parseBlock(builder, props);
  }

  parseSelector(
    parent: Block<T>,
    selector: string,
    object: DeclarationBlock,
    inAtRule: boolean = false,
  ) {
    if (__DEV__) {
      if (!isObject(object)) {
        throw new Error(`Selector "${selector}" must be an object of properties.`);
      } else if ((selector.includes(',') || !selector.match(SELECTOR)) && !inAtRule) {
        throw new Error(
          `Advanced selector "${selector}" must be nested within a @selectors block.`,
        );
      }
    }

    const block = this.parseLocalBlock(new Block(selector), object);

    arrayLoop(selector.split(','), k => {
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

  transformProperty(key: string, value: unknown): Length {
    switch (key) {
      case 'animation':
        return compoundProperties.animation(value as Properties['animation']);

      case 'animationName':
        return compoundProperties.animationName(
          value as Properties['animationName'],
          (name, frames) => this.parseKeyframesAnimation(name, frames),
        );

      case 'fontFamily':
        return compoundProperties.fontFamily(value as Properties['fontFamily'], (name, face) =>
          this.parseFontFace(name, face),
        );

      case 'transition':
        return compoundProperties.transition(value as Properties['transition']);

      default: {
        if (key in expandedProperties && isObject(value)) {
          return expandedProperties[key as keyof typeof expandedProperties](
            value,
            this.applyUnitToValue,
          );
        }
      }
    }

    return value as string;
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector',
    ...args: Parameters<BlockNestedListener<T>>
  ): void;
  emit(
    name: 'block:fallback' | 'block:property',
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
  emit(name: 'keyframes', ...args: Parameters<KeyframesListener<T>>): void;
  emit(name: 'ruleset', ...args: Parameters<RulesetListener<T>>): void;
  emit(name: string, ...args: unknown[]): void {
    if (this.handlers[name]) {
      this.handlers[name](...args);
    }
  }

  /**
   * Register an event listener.
   */
  on(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector',
    callback: BlockNestedListener<T>,
  ): this;
  on(name: 'block:media' | 'block:supports', callback: BlockConditionListener<T>): this;
  on(name: 'block:fallback' | 'block:property', callback: BlockPropertyListener<T>): this;
  on(name: 'block' | 'global' | 'page' | 'viewport', callback: BlockListener<T>): this;
  on(name: 'class', callback: ClassNameListener): this;
  on(name: 'font-face', callback: FontFaceListener<T>): this;
  on(name: 'import', callback: ImportListener): this;
  on(name: 'keyframes', callback: KeyframesListener<T>): this;
  on(name: 'ruleset', callback: RulesetListener<T>): this;
  on(name: string, callback: Handler): this {
    this.handlers[name] = callback;

    return this;
  }
}
