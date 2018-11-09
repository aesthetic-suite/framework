/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import Ruleset from './syntax/Ruleset';
import Sheet from './syntax/Sheet';
import GlobalSheet from './syntax/GlobalSheet';
import formatFontFace from './syntax/formatFontFace';
import {
  AtRule,
  ComponentStyleSheet,
  ComponentRuleset,
  GlobalStyleSheet,
  Keyframes,
} from './types';

export const LOCAL_RULES: AtRule[] = ['@fallbacks', '@media', '@selectors', '@supports'];

export type Handler = (...args: any[]) => void;

export default class UnifiedSyntax<NativeBlock> {
  handlers: { [eventName: string]: Handler } = {};

  /**
   * Convert all at-rules within a global stylesheet.
   */
  convertGlobalSheet(globalSheet: GlobalStyleSheet): Sheet<NativeBlock> {
    const sheet = new GlobalSheet<NativeBlock>();

    Object.keys(globalSheet).forEach(rule => {
      switch (rule) {
        case '@charset': {
          const path = globalSheet[rule];

          if (typeof path === 'string') {
            this.emit(rule, [sheet, path]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error('@charset must be a string.');
          }

          break;
        }

        case '@font-face': {
          const faces = globalSheet[rule] || {};

          if (process.env.NODE_ENV !== 'production') {
            if (!isObject(faces)) {
              throw new Error('@font-face must be an object of font family names to font faces.');
            }
          }

          Object.keys(faces).forEach(fontFamily => {
            const srcPaths: string[][] = [];
            const fontFaces = toArray(faces[fontFamily]).map(font => {
              srcPaths.push(font.srcPaths);

              return formatFontFace({
                ...font,
                fontFamily,
              });
            }) as NativeBlock[];

            this.emit(rule, [sheet, fontFaces, fontFamily, srcPaths]);
          });

          break;
        }

        case '@global': {
          const globals = globalSheet[rule] || {};

          Object.keys(globals).forEach(selector => {
            if (isObject(globals[selector])) {
              this.emit(rule, [
                sheet,
                this.convertRuleset(globals[selector], sheet.createRuleset(selector)),
              ]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error(`Invalid @global selector "${selector}" ruleset.`);
            }
          });

          break;
        }

        case '@import': {
          const paths = globalSheet[rule];

          if (typeof paths === 'string' || Array.isArray(paths)) {
            this.emit(rule, [sheet, toArray(paths).map(path => String(path))]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error('@import must be a string or an array of strings.');
          }

          break;
        }

        case '@keyframes': {
          const frames = globalSheet[rule] || {};

          if (process.env.NODE_ENV !== 'production') {
            if (!isObject(frames)) {
              throw new Error('@keyframes must be an object of animation names to keyframes.');
            }
          }

          Object.keys(frames).forEach(animationName => {
            this.emit(rule, [sheet, frames[animationName] as any, animationName]);
          });

          break;
        }

        case '@page':
        case '@viewport': {
          const style = globalSheet[rule];

          if (isObject(style)) {
            this.emit(rule, [sheet, this.convertRuleset(style, sheet.createRuleset(rule))]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} must be a style object.`);
          }

          break;
        }

        default:
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(
              `Unknown property "${rule}". Only at-rules are allowed in the global stylesheet.`,
            );
          }
          break;
      }
    });

    return sheet;
  }

  /**
   * Convert a mapping of unified rulesets to their native syntax.
   */
  convertStyleSheet(styleSheet: ComponentStyleSheet): Sheet<NativeBlock> {
    const sheet = new Sheet<NativeBlock>();

    Object.keys(styleSheet).forEach(selector => {
      const ruleset = styleSheet[selector];

      if (!ruleset) {
        return;
      }

      // At-rule
      if (selector.charAt(0) === '@') {
        if (process.env.NODE_ENV !== 'production') {
          throw new SyntaxError(`At-rules may not be defined in the root, found "${selector}".`);
        }

        // Class name
      } else if (typeof ruleset === 'string') {
        sheet.addRuleset(selector, ruleset);

        // Style object
      } else if (isObject(ruleset)) {
        sheet.addRuleset(selector, this.convertRuleset(ruleset, sheet.createRuleset(selector)));

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
  emit(eventName: '@charset', args: [GlobalSheet<NativeBlock>, string]): this;
  // emit(eventName: '@fallbacks', args: FallbacksArgs<Ruleset>): this;
  emit(
    eventName: '@font-face',
    args: [GlobalSheet<NativeBlock>, NativeBlock[], string, string[][]],
  ): this;
  // emit(eventName: '@global', args: GlobalArgs<StyleSheet, Ruleset>): this;
  emit(eventName: '@import', args: [GlobalSheet<NativeBlock>, string[]]): this;
  emit(
    eventName: '@keyframes',
    args: [GlobalSheet<NativeBlock>, Keyframes<NativeBlock>, string],
  ): this;
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
  on(
    eventName: '@charset',
    callback: (sheet: GlobalSheet<NativeBlock>, charset: string) => void,
  ): this;
  // on(eventName: '@fallbacks', callback: FallbacksHandler<Ruleset>): this;
  on(
    eventName: '@font-face',
    callback: (
      sheet: GlobalSheet<NativeBlock>,
      fontFaces: NativeBlock[],
      fontFamily: string,
      srcPaths: string[][],
    ) => void,
  ): this;
  // on(eventName: '@global', callback: GlobalHandler<StyleSheet, Ruleset>): this;
  on(
    eventName: '@import',
    callback: (sheet: GlobalSheet<NativeBlock>, paths: string[]) => void,
  ): this;
  on(
    eventName: '@keyframes',
    callback: (
      sheet: GlobalSheet<NativeBlock>,
      keyframes: Keyframes<NativeBlock>,
      animationName: string,
    ) => void,
  ): this;
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
