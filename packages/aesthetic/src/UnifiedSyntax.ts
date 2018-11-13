/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import Ruleset from './syntax/Ruleset';
import Sheet from './syntax/Sheet';
import formatFontFace from './syntax/formatFontFace';
import { ComponentStyleSheet, ComponentRuleset, GlobalStyleSheet, Keyframes } from './types';

export type Handler = (...args: any[]) => void;

export default class UnifiedSyntax<NativeBlock> {
  handlers: { [eventName: string]: Handler } = {};

  /**
   * Convert all at-rules within a global stylesheet.
   */
  convertGlobalSheet(globalSheet: GlobalStyleSheet): Sheet<NativeBlock> {
    const sheet = new Sheet<NativeBlock>();

    Object.keys(globalSheet).forEach(rule => {
      switch (rule) {
        case '@charset': {
          const path = globalSheet[rule];

          if (typeof path === 'string') {
            this.emit('charset', [sheet, path]);
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

            this.emit('font-face', [sheet, fontFaces, fontFamily, srcPaths]);
          });

          break;
        }

        case '@global': {
          const globals = globalSheet[rule] || {};

          Object.keys(globals).forEach(selector => {
            if (isObject(globals[selector])) {
              this.emit('global', [
                sheet,
                selector,
                this.convertRuleset(globals[selector], sheet.createRuleset(selector)),
              ]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error(`Invalid @global selector "${selector}" ruleset, must be an object.`);
            }
          });

          break;
        }

        case '@import': {
          const paths = globalSheet[rule];

          if (typeof paths === 'string' || Array.isArray(paths)) {
            this.emit('import', [sheet, toArray(paths).map(path => String(path))]);
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
            this.emit('keyframes', [sheet, frames[animationName] as any, animationName]);
          });

          break;
        }

        case '@page':
        case '@viewport': {
          const style = globalSheet[rule];

          if (isObject(style)) {
            this.emit(rule.slice(1) as any, [
              sheet,
              this.convertRuleset(style, sheet.createRuleset(rule)),
            ]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} must be a ruleset object.`);
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
        sheet.addClassName(selector, ruleset);

        // Style object
      } else if (isObject(ruleset)) {
        sheet.addRuleset(this.convertRuleset(ruleset, sheet.createRuleset(selector)));

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
        throw new TypeError('Ruleset must be an object of properties.');
      }
    }

    Object.keys(unifiedRuleset).forEach(baseKey => {
      const key = baseKey as keyof ComponentRuleset;
      const value = unifiedRuleset[key];

      if (!value) {
        return;
      }

      switch (key) {
        case '@fallbacks': {
          const fallbacks = unifiedRuleset[key] || {};

          if (process.env.NODE_ENV !== 'production') {
            if (!isObject(fallbacks)) {
              throw new Error('@fallbacks must be an object of property names to fallback values.');
            }
          }

          Object.keys(fallbacks).forEach(property => {
            this.emit('fallback', [
              ruleset,
              property as keyof NativeBlock,
              toArray(fallbacks[property as keyof typeof fallbacks]!),
            ]);
          });

          break;
        }

        case '@media':
        case '@supports': {
          const styles = unifiedRuleset[key] || {};

          Object.keys(styles).forEach(query => {
            if (isObject(styles[query])) {
              this.emit(key.slice(1) as any, [
                ruleset,
                query,
                this.convertRuleset(styles[query], ruleset.createChild(`${key} ${query}`)),
              ]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error(`${key} ${query} must be a mapping of conditions to style objects.`);
            }
          });

          break;
        }

        case '@selectors': {
          const selectors = unifiedRuleset[key] || {};

          if (process.env.NODE_ENV !== 'production') {
            if (!isObject(selectors)) {
              throw new Error('@selectors must be an object of selectors to rulesets.');
            }
          }

          Object.keys(selectors).forEach(key => {
            this.convertSelector(key, selectors[key], ruleset);
          });

          break;
        }

        default: {
          if (key.startsWith('@')) {
            if (process.env.NODE_ENV !== 'production') {
              throw new SyntaxError(`Unsupported local at-rule "${key}".`);
            }
          } else if (key.startsWith(':') || key.startsWith('[')) {
            this.convertSelector(key, value as ComponentRuleset, ruleset);
          } else {
            this.emit('property', [ruleset, key as keyof NativeBlock, value]);
          }

          break;
        }
      }
    });

    return ruleset;
  }

  convertSelector(key: string, value: ComponentRuleset, ruleset: Ruleset<NativeBlock>) {
    if (process.env.NODE_ENV !== 'production') {
      if (!isObject(value)) {
        throw new Error(`Selector "${key}" must be a ruleset object.`);
      }
    }

    key.split(',').forEach(k => {
      const selector = k.trim();
      let type = 'selector';

      if (selector.charAt(0) === ':') {
        type = 'pseudo';
      } else if (selector.charAt(0) === '[') {
        type = 'attribute';
      }

      this.emit(type as any, [
        ruleset,
        selector,
        this.convertRuleset(value, ruleset.createChild(selector)),
      ]);
    });
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: 'attribute', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): this;
  emit(eventName: 'charset', args: [Sheet<NativeBlock>, string]): this;
  emit(eventName: 'fallback', args: [Ruleset<NativeBlock>, keyof NativeBlock, any[]]): this;
  emit(eventName: 'font-face', args: [Sheet<NativeBlock>, NativeBlock[], string, string[][]]): this;
  emit(eventName: 'global', args: [Sheet<NativeBlock>, string, Ruleset<NativeBlock>]): this;
  emit(eventName: 'import', args: [Sheet<NativeBlock>, string[]]): this;
  emit(eventName: 'keyframes', args: [Sheet<NativeBlock>, Keyframes<NativeBlock>, string]): this;
  emit(eventName: 'media', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): this;
  emit(eventName: 'page', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>]): this;
  emit(eventName: 'property', args: [Ruleset<NativeBlock>, keyof NativeBlock, any]): this;
  emit(eventName: 'pseudo', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): this;
  emit(eventName: 'selector', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): this;
  emit(eventName: 'supports', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): this;
  emit(eventName: 'viewport', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>]): this;
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
    eventName: 'attribute',
    callback: (ruleset: Ruleset<NativeBlock>, name: string, value: Ruleset<NativeBlock>) => void,
  ): this;
  on(eventName: 'charset', callback: (sheet: Sheet<NativeBlock>, charset: string) => void): this;
  on(
    eventName: 'fallback',
    callback: (ruleshet: Ruleset<NativeBlock>, name: keyof NativeBlock, values: any[]) => void,
  ): this;
  on(
    eventName: 'font-face',
    callback: (
      sheet: Sheet<NativeBlock>,
      fontFaces: NativeBlock[],
      fontFamily: string,
      srcPaths: string[][],
    ) => void,
  ): this;
  on(
    eventName: 'global',
    callback: (sheet: Sheet<NativeBlock>, selector: string, ruleset: Ruleset<NativeBlock>) => void,
  ): this;
  on(eventName: 'import', callback: (sheet: Sheet<NativeBlock>, paths: string[]) => void): this;
  on(
    eventName: 'keyframes',
    callback: (
      sheet: Sheet<NativeBlock>,
      keyframes: Keyframes<NativeBlock>,
      animationName: string,
    ) => void,
  ): this;
  on(
    eventName: 'media',
    callback: (ruleset: Ruleset<NativeBlock>, query: string, value: Ruleset<NativeBlock>) => void,
  ): this;
  on(
    eventName: 'page',
    callback: (sheet: Sheet<NativeBlock>, ruleset: Ruleset<NativeBlock>) => void,
  ): this;
  on(
    eventName: 'property',
    callback: (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any) => void,
  ): this;
  on(
    eventName: 'pseudo',
    callback: (ruleset: Ruleset<NativeBlock>, name: string, value: Ruleset<NativeBlock>) => void,
  ): this;
  on(
    eventName: 'selector',
    callback: (ruleset: Ruleset<NativeBlock>, name: string, value: Ruleset<NativeBlock>) => void,
  ): this;
  on(
    eventName: 'supports',
    callback: (ruleset: Ruleset<NativeBlock>, query: string, value: Ruleset<NativeBlock>) => void,
  ): this;
  on(
    eventName: 'viewport',
    callback: (sheet: Sheet<NativeBlock>, ruleset: Ruleset<NativeBlock>) => void,
  ): this;
  on(eventName: string, callback: Handler): this {
    this.handlers[eventName] = callback;

    return this;
  }
}
