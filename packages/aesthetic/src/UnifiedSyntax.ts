/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import Ruleset from './syntax/Ruleset';
import StyleSheet from './syntax/StyleSheet';
import formatFontFace from './syntax/formatFontFace';
import { AtRule, Handler, ComponentStyleSheet, ComponentRuleset } from './types';

export const GLOBAL_RULES: AtRule[] = [
  '@charset',
  '@font-face',
  '@global',
  '@import',
  '@keyframes',
  '@page',
  '@viewport',
];

export const LOCAL_RULES: AtRule[] = ['@fallbacks', '@media', '@selectors', '@supports'];

export default class UnifiedSyntax<NativeBlock> {
  handlers: { [eventName: string]: Handler } = {};

  /**
   * Convert a mapping of unified rulesets to their native syntax.
   */
  convert(unifiedSheet: ComponentStyleSheet): StyleSheet<NativeBlock> {
    const sheet = new StyleSheet<NativeBlock>();

    // Extract global at-rules first
    // eslint-disable-next-line complexity
    GLOBAL_RULES.forEach(rule => {
      if (!unifiedSheet[rule]) {
        delete unifiedSheet[rule];

        return;
      }

      switch (rule) {
        case '@charset': {
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

                return this.convertRuleset(
                  formatFontFace({
                    ...font,
                    fontFamily,
                  }) as ComponentRuleset,
                  sheet.createRuleset(fontFamily),
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
        //       this.emit(rule, [sheet, this.convertRuleset(sheet, globals[selector]), selector]);
        //     } else if (process.env.NODE_ENV !== 'production') {
        //       throw new Error('Invalid @global selector style block.');
        //     }
        //   });

        //   break;
        // }

        case '@keyframes': {
          const frames = unifiedSheet[rule];

          if (frames) {
            Object.keys(frames).forEach(animationName => {
              const keyframes = this.convertRuleset(
                frames[animationName] as ComponentRuleset,
                sheet.createRuleset(`${rule} ${animationName}`),
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
            this.emit(rule, [sheet, this.convertRuleset(style, sheet.createRuleset(rule))]);
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

    // Convert rulesets last
    Object.keys(unifiedSheet).forEach(selector => {
      const ruleset = unifiedSheet[selector];

      if (!ruleset) {
        return;
      }

      // At-rule
      if (selector.charAt(0) === '@') {
        if (process.env.NODE_ENV !== 'production') {
          throw new SyntaxError(`Unsupported global at-rule "${selector}".`);
        }

        // Class name
      } else if (typeof ruleset === 'string') {
        sheet.addRuleset(selector, ruleset);

        // Style object
      } else if (isObject(ruleset)) {
        sheet.addRuleset(selector, this.convertRuleset(ruleset, new Ruleset(selector, sheet)));

        // Unknown
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Invalid ruleset for "${selector}".`);
      }
    });

    return sheet;
  }

  /**
   * Convert a ruleset including local at-rules, blocks, and properties.
   */
  convertRuleset(
    unifiedRuleset: ComponentRuleset,
    ruleset: Ruleset<NativeBlock>,
  ): Ruleset<NativeBlock> {
    if (process.env.NODE_ENV !== 'production') {
      if (!unifiedRuleset || typeof unifiedRuleset !== 'object') {
        throw new TypeError('Ruleset must be an object of properties');
      }
    }

    // Convert properties first
    Object.keys(unifiedRuleset).forEach(baseKey => {
      const key = baseKey as keyof ComponentRuleset;
      const value = unifiedRuleset[key];

      switch (baseKey.charAt(0)) {
        case '@':
          return;

        case ':':
        case '[': {
          // Support comma separated selectors
          baseKey.split(',').forEach(selector => {
            this.emit('selector', [
              ruleset,
              selector.trim(),
              this.convertRuleset(value as ComponentRuleset, ruleset.createChild(selector.trim())),
            ]);
          });

          break;
        }

        default:
          this.emit('property', [ruleset, key, value]);
          break;
      }

      delete unifiedRuleset[key];
    });

    LOCAL_RULES.forEach(rule => {
      const key = rule as keyof ComponentRuleset;
      const style = unifiedRuleset[key];

      delete unifiedRuleset[key];

      if (!style || !isObject(style)) {
        return;
      }

      switch (rule) {
        case '@fallbacks':
          const fallbacks = unifiedRuleset[rule] || {};

          Object.keys(fallbacks).forEach(property => {
            this.emit(rule, [ruleset, property, toArray((fallbacks as any)[property])]);
          });
          break;

        case '@media':
        case '@supports':
          const styles = unifiedRuleset[rule] || {};

          Object.keys(styles).forEach(query => {
            if (isObject(styles[query])) {
              this.emit(rule, [
                ruleset,
                query,
                this.convertRuleset(styles[query], ruleset.createChild(`${rule} ${query}`)),
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
      Object.keys(unifiedRuleset).forEach(key => {
        throw new SyntaxError(`Unsupported local at-rule "${key}".`);
      });
    }

    return ruleset;
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  // emit(eventName: '@charset', args: CharsetArgs<StyleSheet>): this;
  // emit(eventName: '@fallbacks', args: FallbacksArgs<Ruleset>): this;
  // emit(eventName: '@font-face', args: FontFaceArgs<StyleSheet>): this;
  // emit(eventName: '@global', args: GlobalArgs<StyleSheet, Ruleset>): this;
  // emit(eventName: '@import', args: ImportArgs<StyleSheet>): this;
  // emit(eventName: '@keyframes', args: KeyframesArgs<StyleSheet>): this;
  // emit(eventName: '@media', args: MediaArgs<Ruleset>): this;
  // emit(eventName: '@namespace', args: NamespaceArgs<StyleSheet>): this;
  // emit(eventName: '@page', args: PageArgs<StyleSheet, Ruleset>): this;
  // emit(eventName: '@supports', args: SupportsArgs<Ruleset>): this;
  // emit(eventName: '@viewport', args: ViewportArgs<StyleSheet, Ruleset>): this;
  // emit(eventName: 'property', args: PropertyArgs<Ruleset>): this;
  // emit(eventName: 'selector', args: SelectorArgs<Ruleset>): this;
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
  // on(eventName: '@fallbacks', callback: FallbacksHandler<Ruleset>): this;
  // on(eventName: '@font-face', callback: FontFaceHandler<StyleSheet>): this;
  // on(eventName: '@global', callback: GlobalHandler<StyleSheet, Ruleset>): this;
  // on(eventName: '@import', callback: ImportHandler<StyleSheet>): this;
  // on(eventName: '@keyframes', callback: KeyframesHandler<StyleSheet>): this;
  // on(eventName: '@media', callback: MediaHandler<Ruleset>): this;
  // on(eventName: '@namespace', callback: NamespaceHandler<StyleSheet>): this;
  // on(eventName: '@page', callback: PageHandler<StyleSheet, Ruleset>): this;
  // on(eventName: '@supports', callback: SupportsHandler<Ruleset>): this;
  // on(eventName: '@viewport', callback: ViewportHandler<StyleSheet, Ruleset>): this;
  // on(eventName: 'property', callback: PropertyHandler<Ruleset>): this;
  // on(eventName: 'selector', callback: SelectorHandler<Ruleset>): this;
  on(eventName: string, callback: Handler): this {
    this.handlers[eventName] = callback;

    return this;
  }
}
