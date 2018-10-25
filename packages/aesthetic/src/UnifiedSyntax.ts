/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import Declaration from './syntax/Declaration';
import StyleSheet from './syntax/StyleSheet';
import { AtRule, Handler, UnifiedStyleSheet, UnifiedDeclaration } from './types';
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

export default class UnifiedSyntax<Properties extends object> {
  handlers: { [eventName: string]: Handler } = {};

  /**
   * Convert a mapping of style declarations to their native syntax.
   */
  convert(unifiedSheet: UnifiedStyleSheet): StyleSheet<Properties> {
    const sheet = new StyleSheet<Properties>();

    // Extract global at-rules first
    // eslint-disable-next-line complexity
    GLOBAL_RULES.forEach(rule => {
      if (!unifiedSheet[rule]) {
        delete unifiedSheet[rule];

        return;
      }

      switch (rule) {
        case '@charset':
        case '@namespace': {
          const path = unifiedSheet[rule];

          if (typeof path === 'string') {
            this.emit(rule, [sheet, path]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} value must be a string.`);
          }

          break;
        }

        case '@import': {
          const paths = unifiedSheet[rule];

          if (typeof paths === 'string' || Array.isArray(paths)) {
            this.emit(rule, [sheet, toArray(paths)]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} value must be a string, or an array of strings.`);
          }

          break;
        }

        case '@font-face': {
          const faces = unifiedSheet[rule];

          if (faces) {
            Object.keys(faces).forEach(fontFamily => {
              const srcPaths: string[][] = [];
              const fontFaces = toArray(faces[fontFamily]).map(font => {
                srcPaths.push(font.srcPaths);

                return this.convertDeclaration(
                  sheet.createDeclaration(fontFamily),
                  formatFontFace({
                    ...font,
                    fontFamily,
                  }),
                );
              });

              this.emit(rule, [sheet, fontFaces, fontFamily, srcPaths]);
            });
          }

          break;
        }

        // case '@global': {
        //   const globals = unifiedSheet[rule];

        //   if (!globals) {
        //     return;
        //   }

        //   Object.keys(globals).forEach(selector => {
        //     if (isObject(globals[selector])) {
        //       this.emit(rule, [sheet, this.convertDeclaration(sheet, globals[selector]), selector]);
        //     } else if (process.env.NODE_ENV !== 'production') {
        //       throw new Error('Invalid @global selector style declaration.');
        //     }
        //   });

        //   break;
        // }

        case '@keyframes': {
          const frames = unifiedSheet[rule];

          if (frames) {
            Object.keys(frames).forEach(animationName => {
              const keyframes = this.convertDeclaration(
                sheet.createDeclaration(`${rule} ${animationName}`),
                frames[animationName],
              );

              this.emit(rule, [sheet, keyframes, animationName]);
            });
          }

          break;
        }

        case '@page':
        case '@viewport': {
          const style = unifiedSheet[rule];

          if (isObject(style)) {
            this.emit(rule, [sheet, this.convertDeclaration(sheet.createDeclaration(rule), style)]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} must be a style object.`);
          }

          break;
        }

        /* istanbul ignore next */
        default:
          break;
      }

      delete unifiedSheet[rule];
    });

    // Convert declarations last
    Object.keys(unifiedSheet).forEach(selector => {
      const declaration = unifiedSheet[selector];

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
        sheet.addDeclaration(selector, declaration);

        // Style object
      } else if (isObject(declaration)) {
        sheet.addDeclaration(
          selector,
          this.convertDeclaration(new Declaration(selector, sheet), declaration),
        );

        // Unknown
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Invalid style declaration for "${selector}".`);
      }
    });

    return sheet;
  }

  /**
   * Convert a style declaration including local at-rules and properties.
   */
  convertDeclaration(
    declaration: Declaration<Properties>,
    unifiedDeclaration: UnifiedDeclaration,
  ): Declaration<Properties> {
    if (process.env.NODE_ENV !== 'production') {
      if (!unifiedDeclaration || typeof unifiedDeclaration !== 'object') {
        throw new TypeError('Declaration must be an object of properties');
      }
    }

    // Convert properties first
    Object.keys(unifiedDeclaration).forEach(key => {
      const value = unifiedDeclaration[key];

      switch (key.charAt(0)) {
        case '@':
          return;

        case ':':
        case '>':
        case '[': {
          // Support comma separated selectors
          key.split(',').forEach(selector => {
            this.emit('selector', [
              declaration,
              selector.trim(),
              this.convertDeclaration(declaration.createChild(selector.trim()), value),
            ]);
          });

          break;
        }

        default:
          this.emit('property', [declaration, key, value]);
          break;
      }

      delete unifiedDeclaration[key];
    });

    // Extract local at-rules first
    LOCAL_RULES.forEach(rule => {
      const style = unifiedDeclaration[rule];

      delete unifiedDeclaration[rule];

      if (!style || !isObject(style)) {
        return;
      }

      switch (rule) {
        case '@fallbacks':
          const fallbacks = unifiedDeclaration[rule] || {};

          Object.keys(fallbacks).forEach(property => {
            this.emit(rule, [declaration, property, toArray((fallbacks as any)[property])]);
          });
          break;

        case '@media':
        case '@supports':
          const styles = unifiedDeclaration[rule] || {};

          Object.keys(styles).forEach(query => {
            if (isObject(styles[query])) {
              this.emit(rule, [
                declaration,
                query,
                this.convertDeclaration(declaration.createChild(`${rule} ${query}`), styles[query]),
              ]);
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
      Object.keys(unifiedDeclaration).forEach(key => {
        throw new SyntaxError(`Unsupported local at-rule "${key}".`);
      });
    }

    return declaration;
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
  // emit(eventName: '@charset', args: CharsetArgs<StyleSheet>): this;
  // emit(eventName: '@fallbacks', args: FallbacksArgs<Declaration>): this;
  // emit(eventName: '@font-face', args: FontFaceArgs<StyleSheet>): this;
  // emit(eventName: '@global', args: GlobalArgs<StyleSheet, Declaration>): this;
  // emit(eventName: '@import', args: ImportArgs<StyleSheet>): this;
  // emit(eventName: '@keyframes', args: KeyframesArgs<StyleSheet>): this;
  // emit(eventName: '@media', args: MediaArgs<Declaration>): this;
  // emit(eventName: '@namespace', args: NamespaceArgs<StyleSheet>): this;
  // emit(eventName: '@page', args: PageArgs<StyleSheet, Declaration>): this;
  // emit(eventName: '@supports', args: SupportsArgs<Declaration>): this;
  // emit(eventName: '@viewport', args: ViewportArgs<StyleSheet, Declaration>): this;
  // emit(eventName: 'property', args: PropertyArgs<Declaration>): this;
  // emit(eventName: 'selector', args: SelectorArgs<Declaration>): this;
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
  // on(eventName: '@charset', callback: CharsetHandler<StyleSheet>): this;
  // on(eventName: '@fallbacks', callback: FallbacksHandler<Declaration>): this;
  // on(eventName: '@font-face', callback: FontFaceHandler<StyleSheet>): this;
  // on(eventName: '@global', callback: GlobalHandler<StyleSheet, Declaration>): this;
  // on(eventName: '@import', callback: ImportHandler<StyleSheet>): this;
  // on(eventName: '@keyframes', callback: KeyframesHandler<StyleSheet>): this;
  // on(eventName: '@media', callback: MediaHandler<Declaration>): this;
  // on(eventName: '@namespace', callback: NamespaceHandler<StyleSheet>): this;
  // on(eventName: '@page', callback: PageHandler<StyleSheet, Declaration>): this;
  // on(eventName: '@supports', callback: SupportsHandler<Declaration>): this;
  // on(eventName: '@viewport', callback: ViewportHandler<StyleSheet, Declaration>): this;
  // on(eventName: 'property', callback: PropertyHandler<Declaration>): this;
  // on(eventName: 'selector', callback: SelectorHandler<Declaration>): this;
  on(eventName: string, callback: Handler): this {
    this.handlers[eventName] = callback;

    return this;
  }
}
