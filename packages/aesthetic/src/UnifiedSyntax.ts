/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import {
  AtRule,
  Handler,
  FontFace,
  Keyframes,
  UnifiedStyleSheet,
  UnifiedDeclaration,
  CharsetArgs,
  CharsetHandler,
  FallbacksArgs,
  FallbacksHandler,
  FontFaceArgs,
  FontFaceHandler,
  GlobalArgs,
  GlobalHandler,
  ImportArgs,
  ImportHandler,
  KeyframesArgs,
  KeyframesHandler,
  MediaArgs,
  MediaHandler,
  NamespaceArgs,
  NamespaceHandler,
  PageArgs,
  PageHandler,
  PropertyArgs,
  PropertyHandler,
  SelectorArgs,
  SelectorHandler,
  SupportsArgs,
  SupportsHandler,
  ViewportArgs,
  ViewportHandler,
} from './types';
import { formatFontFace } from '.';

export const GLOBAL_RULES: AtRule[] = [
  '@charset',
  '@font-face',
  '@global',
  '@import',
  '@keyframes',
  '@namespace',
  '@page',
  '@viewport',
];

export const LOCAL_RULES: AtRule[] = ['@fallbacks', '@media', '@supports'];

export default class UnifiedSyntax<StyleSheet, Declaration> {
  fontFaces: { [fontFamily: string]: FontFace[] } = {};

  handlers: { [eventName: string]: Handler } = {};

  keyframes: { [animationName: string]: Keyframes } = {};

  /**
   * Convert a mapping of style declarations to their native syntax.
   */
  convert(styleSheet: UnifiedStyleSheet): StyleSheet {
    const prevStyleSheet: UnifiedStyleSheet = { ...styleSheet };
    const nextStyleSheet: any = {};

    // Extract global at-rules first
    // eslint-disable-next-line complexity
    GLOBAL_RULES.forEach(rule => {
      if (!prevStyleSheet[rule]) {
        delete prevStyleSheet[rule];

        return;
      }

      switch (rule) {
        case '@charset':
        case '@namespace': {
          const path = prevStyleSheet[rule];

          if (typeof path === 'string') {
            this.emit(rule, [nextStyleSheet, path]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} value must be a string.`);
          }

          break;
        }

        case '@import': {
          const paths = prevStyleSheet[rule];

          if (typeof paths === 'string' || Array.isArray(paths)) {
            this.emit(rule, [nextStyleSheet, toArray(paths)]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} value must be a string, or an array of strings.`);
          }

          break;
        }

        case '@font-face': {
          const faces = prevStyleSheet[rule];

          if (faces) {
            Object.keys(faces).forEach(fontFamily => {
              const srcPaths: string[][] = [];

              this.fontFaces[fontFamily] = toArray(faces[fontFamily]).map(font => {
                srcPaths.push(font.srcPaths);

                return formatFontFace({
                  ...font,
                  fontFamily,
                });
              });

              this.emit(rule, [nextStyleSheet, this.fontFaces[fontFamily], fontFamily, srcPaths]);
            });
          }

          break;
        }

        case '@global': {
          const globals = prevStyleSheet[rule];

          if (!globals) {
            return;
          }

          Object.keys(globals).forEach(selector => {
            if (isObject(globals[selector])) {
              this.emit(rule, [
                nextStyleSheet,
                this.convertDeclaration(globals[selector]),
                selector,
              ]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error('Invalid @global selector style declaration.');
            }
          });

          break;
        }

        case '@keyframes': {
          const frames = prevStyleSheet[rule];

          if (frames) {
            Object.keys(frames).forEach(animationName => {
              this.keyframes[animationName] = this.convertDeclaration<Keyframes>(
                frames[animationName],
              );

              this.emit(rule, [nextStyleSheet, this.keyframes[animationName], animationName]);
            });
          }

          break;
        }

        case '@page':
        case '@viewport': {
          const style = prevStyleSheet[rule];

          if (isObject(style)) {
            this.emit(rule, [nextStyleSheet, this.convertDeclaration(style)]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} must be a style object.`);
          }

          break;
        }

        /* istanbul ignore next */
        default:
          break;
      }

      delete prevStyleSheet[rule];
    });

    // Convert declarations last
    Object.keys(prevStyleSheet).forEach(selector => {
      const declaration = prevStyleSheet[selector];

      if (!declaration) {
        return;
      }

      // At-rule
      if (selector.charAt(0) === '@') {
        if (process.env.NODE_ENV !== 'production') {
          throw new SyntaxError(`Unsupported global at-rule "${selector}".`);
        }

        // Class name
      } else if (typeof declaration === 'string') {
        nextStyleSheet[selector] = declaration;

        // Style object
      } else if (isObject(declaration)) {
        nextStyleSheet[selector] = this.convertDeclaration(declaration);

        // Unknown
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Invalid style declaration for "${selector}".`);
      }
    });

    return nextStyleSheet;
  }

  /**
   * Convert a style declaration including local at-rules and properties.
   */
  convertDeclaration<T = Declaration>(declaration: UnifiedDeclaration): T {
    const prevDeclaration: UnifiedDeclaration = { ...declaration };
    const nextDeclaration: any = {};

    // Convert properties first
    Object.keys(prevDeclaration).forEach(key => {
      const value = prevDeclaration[key];

      switch (key.charAt(0)) {
        case '@':
          return;

        case ':':
        case '>':
        case '[': {
          // Support comma separated selectors
          key.split(',').forEach(k => {
            this.emit('selector', [nextDeclaration, value, k.trim()]);
          });

          break;
        }

        default:
          if (isObject(value)) {
            this.emit('property', [nextDeclaration, this.convertDeclaration(declaration), key]);
          } else {
            this.emit('property', [nextDeclaration, value, key]);
          }
          break;
      }

      delete prevDeclaration[key];
    });

    // Extract local at-rules first
    LOCAL_RULES.forEach(rule => {
      const style = prevDeclaration[rule];

      delete prevDeclaration[rule];

      if (!style || !isObject(style)) {
        return;
      }

      switch (rule) {
        case '@fallbacks':
          const fallbacks = prevDeclaration[rule] || {};

          Object.keys(fallbacks).forEach(property => {
            this.emit(rule, [nextDeclaration, toArray((fallbacks as any)[property]), property]);
          });
          break;

        case '@media':
        case '@supports':
          const styles = prevDeclaration[rule] || {};

          Object.keys(styles).forEach(query => {
            if (isObject(styles[query])) {
              this.emit(rule, [nextDeclaration, this.convertDeclaration(styles[query]), query]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error(`${rule} ${query} must be a mapping of conditions to style objects.`);
            }
          });
          break;

        default:
          return;
      }
    });

    // Error for unknown at-rules
    if (process.env.NODE_ENV !== 'production') {
      Object.keys(prevDeclaration).forEach(key => {
        throw new SyntaxError(`Unsupported local at-rule "${key}".`);
      });
    }

    return nextDeclaration as T;
  }

  /**
   * Create a noop function that throws an error for unsupported features.
   */
  createUnsupportedHandler(rule: AtRule): () => void {
    return () => {
      throw new Error(`Adapter does not support "${rule}".`);
    };
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: '@charset', args: CharsetArgs<StyleSheet>): this;
  emit(eventName: '@fallbacks', args: FallbacksArgs<Declaration>): this;
  emit(eventName: '@font-face', args: FontFaceArgs<StyleSheet>): this;
  emit(eventName: '@global', args: GlobalArgs<StyleSheet, Declaration>): this;
  emit(eventName: '@import', args: ImportArgs<StyleSheet>): this;
  emit(eventName: '@keyframes', args: KeyframesArgs<StyleSheet>): this;
  emit(eventName: '@media', args: MediaArgs<Declaration>): this;
  emit(eventName: '@namespace', args: NamespaceArgs<StyleSheet>): this;
  emit(eventName: '@page', args: PageArgs<StyleSheet, Declaration>): this;
  emit(eventName: '@supports', args: SupportsArgs<Declaration>): this;
  emit(eventName: '@viewport', args: ViewportArgs<StyleSheet, Declaration>): this;
  emit(eventName: 'property', args: PropertyArgs<Declaration>): this;
  emit(eventName: 'selector', args: SelectorArgs<Declaration>): this;
  emit(eventName: string, args: any[]): this {
    if (this.handlers[eventName]) {
      this.handlers[eventName](...args);
    }

    return this;
  }

  /**
   * Delete an event listener.
   */
  off(eventName: string): this {
    delete this.handlers[eventName];

    return this;
  }

  /**
   * Register an event listener.
   */
  on(eventName: '@charset', callback: CharsetHandler<StyleSheet>): this;
  on(eventName: '@fallbacks', callback: FallbacksHandler<Declaration>): this;
  on(eventName: '@font-face', callback: FontFaceHandler<StyleSheet>): this;
  on(eventName: '@global', callback: GlobalHandler<StyleSheet, Declaration>): this;
  on(eventName: '@import', callback: ImportHandler<StyleSheet>): this;
  on(eventName: '@keyframes', callback: KeyframesHandler<StyleSheet>): this;
  on(eventName: '@media', callback: MediaHandler<Declaration>): this;
  on(eventName: '@namespace', callback: NamespaceHandler<StyleSheet>): this;
  on(eventName: '@page', callback: PageHandler<StyleSheet, Declaration>): this;
  on(eventName: '@supports', callback: SupportsHandler<Declaration>): this;
  on(eventName: '@viewport', callback: ViewportHandler<StyleSheet, Declaration>): this;
  on(eventName: 'property', callback: PropertyHandler<Declaration>): this;
  on(eventName: 'selector', callback: SelectorHandler<Declaration>): this;
  on(eventName: string, callback: Handler): this {
    this.handlers[eventName] = callback;

    return this;
  }
}
