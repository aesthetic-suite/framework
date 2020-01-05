/* eslint-disable lines-between-class-members, no-dupe-class-members, @typescript-eslint/unified-signatures */

import { isObject } from 'aesthetic-utils';
import Block from './Block';
import { DeclarationBlock, Keyframes, FontFace, Properties } from './types';
import formatFontFace from './formatFontFace';

export const SELECTOR = /^((\[[a-z-]+\])|(::?[a-z-]+))$/iu;

// Any is required for method overloading to work
export type Handler = (...args: any[]) => void;

export default abstract class Parser<T extends object = {}> {
  protected handlers: { [eventName: string]: Handler } = {};

  parseBlock(selector: string, object: DeclarationBlock): Block<T> {
    if (__DEV__) {
      if (!isObject(object)) {
        throw new TypeError(`Block "${selector}" must be an object of properties.`);
      }
    }

    const block = new Block<T>(selector);

    Object.entries(object).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      // Pseudo and attribute selectors
      if (key.startsWith(':') || key.startsWith('[')) {
        this.parseSelector(block, key, value as DeclarationBlock);

        // Special case for unique at-rules (page blocks)
      } else if (key.startsWith('@')) {
        block.addNested(this.parseBlock(key, value as DeclarationBlock));

        // Run for each property so it can be customized
      } else {
        this.emit('block:property', block, key as keyof T, value);
      }
    });

    this.emit('block', block);

    return block;
  }

  parseFontFace(fontFamily: string, object: FontFace) {
    const fontFace = formatFontFace({
      ...object,
      fontFamily,
    }) as Properties;

    this.emit('font-face', this.parseBlock('@font-face', fontFace), fontFamily, object.srcPaths);
  }

  parseKeyframe(animationName: string, object: Keyframes) {
    const name = object.name || animationName;
    const keyframe = new Block<T>(`@keyframes ${name}`);

    // from, to, and percent keys aren't easily detectable
    Object.entries(object).forEach(([key, value]) => {
      if (key === 'name' || value === undefined) {
        return;
      }

      if (typeof value !== 'string') {
        keyframe.addNested(this.parseBlock(key, value));
      }
    });

    this.emit('keyframe', keyframe, name);
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

    const block = this.parseBlock(selector, object);

    selector.split(',').forEach(k => {
      const name = k.trim();
      let type = 'block:selector';

      if (selector.charAt(0) === ':') {
        type = 'block:pseudo';
      } else if (selector.charAt(0) === '[') {
        type = 'block:attribute';
      }

      this.emit(type as 'block:selector', parent, name, block.clone(name));
    });
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector',
    block: Block<T>,
    key: string,
    value: Block<T>,
  ): unknown;
  emit(name: 'block:property', block: Block<T>, key: keyof T, value: unknown): unknown;
  emit(name: 'charset', charset: string): unknown;
  emit(name: 'font-face', fontFace: Block<T>, fontFamily: string, srcPaths: string[]): unknown;
  emit(name: 'import', path: string): unknown;
  emit(name: 'keyframe', keyframe: Block<T>, animationName: string): unknown;
  emit(name: 'block' | 'page' | 'viewport', block: Block<T>): unknown;
  emit(name: string, ...args: unknown[]): unknown {
    if (this.handlers[name]) {
      return this.handlers[name](...args);
    }

    return undefined;
  }

  /**
   * Delete an event listener.
   */
  off(name: string): this {
    delete this.handlers[name];

    return this;
  }

  /**
   * Register an event listener.
   */
  on(
    name: 'block:attribute' | 'block:pseudo' | 'block:selector',
    callback: (block: Block<T>, name: string, value: Block<T>) => void,
  ): this;
  on(
    name: 'block:property',
    callback: (block: Block<T>, key: keyof T, value: unknown) => void,
  ): this;
  on(name: 'charset', callback: (charset: string) => void): this;
  on(
    name: 'font-face',
    callback: (fontFace: Block<T>, fontFamily: string, srcPaths: string[]) => void,
  ): this;
  on(name: 'import', callback: (path: string) => void): this;
  on(name: 'block' | 'page' | 'viewport', callback: (block: Block<T>) => void): this;
  on(name: string, callback: Handler): this {
    this.handlers[name] = callback;

    return this;
  }
}
