/* eslint-disable lines-between-class-members, no-dupe-class-members, complexity */

import formatFontFace from './helpers/formatFontFace';
import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import Ruleset from './Ruleset';
import Sheet from './Sheet';
import { ComponentBlock, FontFace, GlobalSheet, Keyframes, Properties, StyleSheet } from './types';

export const SELECTOR = /^((\[[a-z-]+\])|(::?[a-z-]+))$/iu;

export type Handler = (...args: any[]) => void;

export default class UnifiedSyntax<NativeBlock extends object> {
  handlers: { [eventName: string]: Handler } = {};

  keyframesCount: number = 0;

  constructor() {
    this.on('property:animationName', this.handleAnimationName);
    this.on('property:fontFamily', this.handleFontFamily);
  }

  /**
   * Convert at-rules within a global stylesheet.
   */
  convertGlobalSheet(globalSheet: GlobalSheet): Sheet<NativeBlock> {
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
            this.convertFontFaces(fontFamily, toArray(faces[fontFamily]), sheet);
          });

          break;
        }

        case '@global': {
          const globals = globalSheet[rule] || {};

          if (process.env.NODE_ENV !== 'production') {
            if (!isObject(globals)) {
              throw new Error('@global must be an object of selectors to ruleset objects.');
            }
          }

          Object.keys(globals).forEach(selector => {
            if (isObject(globals[selector])) {
              this.emit('global', [
                sheet,
                selector,
                this.convertRuleset(globals[selector], sheet.createRuleset(selector)),
              ]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error(`@global "${selector}" must be a ruleset object.`);
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
            this.convertKeyframe(animationName, frames[animationName], sheet);
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

        default: {
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(
              `Unknown property "${rule}". Only at-rules are allowed in the global stylesheet.`,
            );
          }
        }
      }
    });

    return sheet;
  }

  /**
   * Convert a mapping of unified rulesets to their native syntax.
   */
  convertStyleSheet(styleSheet: StyleSheet): Sheet<NativeBlock> {
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
        throw new Error(`Invalid ruleset for "${selector}". Must be an object or class name.`);
      }
    });

    return sheet;
  }

  /**
   * Convert a ruleset including local at-rules, blocks, and properties.
   */
  convertRuleset(
    unifiedRuleset: ComponentBlock,
    ruleset: Ruleset<NativeBlock>,
  ): Ruleset<NativeBlock> {
    if (process.env.NODE_ENV !== 'production') {
      if (!isObject(unifiedRuleset)) {
        throw new TypeError('Ruleset must be an object of properties.');
      }
    }

    const atRules: string[] = [];

    Object.keys(unifiedRuleset).forEach(baseKey => {
      const key = baseKey as keyof ComponentBlock;
      const value = unifiedRuleset[key];

      if (typeof value === 'undefined') {
        return;
      }

      if (key.startsWith('@')) {
        atRules.push(key);
      } else if (key.startsWith(':') || key.startsWith('[')) {
        this.convertSelector(key, value as ComponentBlock, ruleset);
      } else {
        // @ts-ignore These events are internal only, so ignore the type issues
        const newValue = this.emit(`property:${key}`, [ruleset, value]);

        this.emit('property', [ruleset, key as keyof NativeBlock, newValue || value]);
      }
    });

    // Process at-rule's after properties, as some at-rule's may require
    // a property or nested value to exist before modifying it.
    atRules.forEach(key => {
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

          if (process.env.NODE_ENV !== 'production') {
            if (!isObject(styles)) {
              throw new Error(`${key} must be an object of queries to rulesets.`);
            }
          }

          Object.keys(styles).forEach(query => {
            if (isObject(styles[query])) {
              const event = key === '@media' ? 'media' : 'support';

              this.emit(event as any, [
                ruleset,
                query,
                this.convertRuleset(styles[query], ruleset.createRuleset(`${key} ${query}`)),
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

          Object.keys(selectors).forEach(selector => {
            this.convertSelector(selector, selectors[selector], ruleset, true);
          });

          break;
        }

        default: {
          if (process.env.NODE_ENV !== 'production') {
            throw new SyntaxError(`Unsupported local at-rule "${key}".`);
          }
        }
      }
    });

    return ruleset;
  }

  /**
   * Convert a nested selector ruleset by emitting the appropriate name.
   */
  convertSelector(
    key: string,
    value: ComponentBlock,
    ruleset: Ruleset<NativeBlock>,
    inAtRule: boolean = false,
  ) {
    if (process.env.NODE_ENV !== 'production') {
      if (!isObject(value)) {
        throw new Error(`Selector "${key}" must be a ruleset object.`);
      } else if ((key.includes(',') || !key.match(SELECTOR)) && !inAtRule) {
        throw new Error(`Advanced selector "${key}" must be nested within an @selectors block.`);
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
        this.convertRuleset(value, ruleset.createRuleset(selector)),
      ]);
    });
  }

  /**
   * Convert a unified syntax list of font face objects to rulesets.
   */
  convertFontFaces(fontFamily: string, faces: FontFace[], sheet: Sheet<NativeBlock>) {
    const srcPaths: string[][] = [];
    const fontFaces = faces.map(font => {
      srcPaths.push(font.srcPaths);

      return this.convertRuleset(
        formatFontFace({
          ...font,
          fontFamily,
        }) as ComponentBlock,
        sheet.createRuleset(fontFamily),
      );
    });

    this.emit('font-face', [sheet, fontFaces, fontFamily, srcPaths]);
  }

  /**
   * Convert a unified syntax keyframes object to a ruleset.
   */
  convertKeyframe(animationName: string, frames: Keyframes, sheet: Sheet<NativeBlock>) {
    const keyframe = sheet.createRuleset(animationName);

    // from, to, and percent keys aren't easily detectable
    // when converting a ruleset. We also don't want adapters
    // to have to worry about it, so do it manually here.
    Object.keys(frames).forEach(key => {
      const value = frames[key];

      // Filter out "name" property
      if (typeof value !== 'string' && typeof value !== 'undefined') {
        keyframe.addNested(key, this.convertRuleset(value, keyframe.createRuleset(key)));
      }
    });

    this.emit('keyframe', [sheet, keyframe, animationName]);
  }

  /**
   * Support keyframe objects within the `animationName` property.
   */
  handleAnimationName = (ruleset: Ruleset<NativeBlock>, value: Properties['animationName']) => {
    if (!value) {
      return undefined;
    }

    return (Array.isArray(value) ? value : [value])
      .map(item => {
        if (typeof item === 'string') {
          return item;
        }

        const name = item.name || `keyframe-${(this.keyframesCount += 1)}`;

        this.convertKeyframe(name, item, ruleset.root);

        return name;
      })
      .join(', ');
  };

  /**
   * Support font face objets within the `fontFamily` property.
   */
  handleFontFamily = (ruleset: Ruleset<NativeBlock>, value: Properties['fontFamily']) => {
    if (!value) {
      return undefined;
    }

    const output: Set<string> = new Set();
    const fontFaces: { [fontFamily: string]: FontFace[] } = {};

    toArray(value).forEach(item => {
      if (typeof item === 'string') {
        output.add(item);

        return;
      }

      const name = item.fontFamily;

      if (!name) {
        return;
      }

      output.add(name);

      if (fontFaces[name]) {
        fontFaces[name].push(item);
      } else {
        fontFaces[name] = [item];
      }
    });

    Object.keys(fontFaces).forEach(fontFamily => {
      this.convertFontFaces(fontFamily, fontFaces[fontFamily], ruleset.root);
    });

    return Array.from(output).join(', ');
  };

  /**
   * Replace a `fontFamily` property with font face objects of the same name.
   */
  injectFontFaces<D>(
    value: string = '',
    cache: { [fontFamily: string]: D[] } = {},
  ): (string | D)[] {
    const fontFaces: (string | D)[] = [];

    value.split(',').forEach(name => {
      const familyName = name.trim();
      const fonts = cache[familyName];

      if (Array.isArray(fonts)) {
        fontFaces.push(...fonts);
      } else {
        fontFaces.push(familyName);
      }
    });

    return fontFaces;
  }

  /**
   * Replace a `animationName` property with keyframe objects of the same name.
   */
  injectKeyframes<D>(
    value: string = '',
    cache: { [animationName: string]: D } = {},
  ): (string | D)[] {
    return value.split(',').map(name => {
      const animationName = name.trim();

      return cache[animationName] || animationName;
    });
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: 'attribute', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): any;
  emit(eventName: 'charset', args: [Sheet<NativeBlock>, string]): any;
  emit(eventName: 'fallback', args: [Ruleset<NativeBlock>, keyof NativeBlock, any[]]): any;
  emit(
    eventName: 'font-face',
    args: [Sheet<NativeBlock>, Ruleset<NativeBlock>[], string, string[][]],
  ): any;
  emit(eventName: 'global', args: [Sheet<NativeBlock>, string, Ruleset<NativeBlock>]): any;
  emit(eventName: 'import', args: [Sheet<NativeBlock>, string[]]): any;
  emit(eventName: 'keyframe', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>, string]): any;
  emit(eventName: 'media', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): any;
  emit(eventName: 'page', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>]): any;
  emit(eventName: 'property', args: [Ruleset<NativeBlock>, keyof NativeBlock, any]): any;
  emit(
    eventName: 'property:animationName',
    args: [Ruleset<NativeBlock>, Properties['animationName']],
  ): any;
  emit(
    eventName: 'property:fontFamily',
    args: [Ruleset<NativeBlock>, Properties['fontFamily']],
  ): any;
  emit(eventName: 'pseudo', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): any;
  emit(eventName: 'selector', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): any;
  emit(eventName: 'support', args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>]): any;
  emit(eventName: 'viewport', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>]): any;
  emit(eventName: string, args: any[]): any {
    if (this.handlers[eventName]) {
      return this.handlers[eventName](...args);
    }

    return undefined;
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
    callback: (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, values: any[]) => void,
  ): this;
  on(
    eventName: 'font-face',
    callback: (
      sheet: Sheet<NativeBlock>,
      fontFaces: Ruleset<NativeBlock>[],
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
    eventName: 'keyframe',
    callback: (
      sheet: Sheet<NativeBlock>,
      keyframe: Ruleset<NativeBlock>,
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
    eventName: 'property:animationName',
    callback: (ruleset: Ruleset<NativeBlock>, value: Properties['animationName']) => any,
  ): this;
  on(
    eventName: 'property:fontFamily',
    callback: (ruleset: Ruleset<NativeBlock>, value: Properties['fontFamily']) => any,
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
    eventName: 'support',
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
