/* eslint-disable lines-between-class-members, no-dupe-class-members, complexity */

import Stylis from 'stylis';
import { convertProperty } from 'rtl-css-js/core';
import { formatFontFace, isObject, isRTL, toArray } from 'aesthetic-utils';
import Ruleset from './Ruleset';
import Sheet from './Sheet';
import {
  ComponentBlock,
  FontFace,
  GlobalSheet,
  Keyframes,
  Properties,
  StyleSheet,
  ClassName,
  TransformOptions,
} from './types';

export const SELECTOR = /^((\[[a-z-]+\])|(::?[a-z-]+))$/iu;
export const CLASS_NAME = /^[a-z]{1}[a-z0-9-_]+$/iu;

// Any is required for method overloading to work.
export type Handler = (...args: any[]) => void;

// `rtl-css-js` operates on objects while `stylis` uses strings.
// Super annoying, so we need to bridge that gap with this helper.
function rtlPlugin(context: number, content: string) {
  if (context !== 1) {
    return undefined;
  }

  const [rawKey, rawValue] = content.split(':', 2);
  const isQuoted = rawValue.trim().startsWith("'");
  const unquotedValue = isQuoted ? rawValue.slice(1).slice(0, -1) : rawValue;
  const { key, value } = convertProperty(rawKey.trim(), unquotedValue.trim());

  return `${key}:${isQuoted ? `'${value}'` : value}`;
}

export default class UnifiedSyntax<NativeBlock extends object> {
  handlers: { [eventName: string]: Handler } = {};

  keyframesCount: number = 0;

  constructor() {
    this.on('property:animationName', this.handleAnimationName);
    this.on('property:fontFamily', this.handleFontFamily);
  }

  /**
   * Convert at-rules within a global style sheet.
   */
  convertGlobalSheet(globalSheet: GlobalSheet, options: TransformOptions): Sheet<NativeBlock> {
    const sheet = new Sheet<NativeBlock>(options);

    Object.keys(globalSheet).forEach(rule => {
      switch (rule) {
        /* case '@charset': {
          const charset = globalSheet[rule];

          if (typeof charset === 'string') {
            this.emit('charset', [sheet, charset]);
          } else if (__DEV__) {
            throw new Error('@charset must be a string.');
          }

          break;
        }

        case '@font-face': {
          const faces = globalSheet[rule] || {};

          if (__DEV__) {
            if (!isObject(faces)) {
              throw new Error('@font-face must be an object of font family names to font faces.');
            }
          }

          Object.keys(faces).forEach(fontFamily => {
            this.convertFontFaces(fontFamily, toArray(faces[fontFamily]), sheet);
          });

          break;
        } */

        case '@global': {
          const globals = globalSheet[rule] || {};

          if (__DEV__) {
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
            } else if (__DEV__) {
              throw new Error(`@global "${selector}" must be a ruleset object.`);
            }
          });

          break;
        }

        /* case '@import': {
          const paths = globalSheet[rule];

          if (typeof paths === 'string' || Array.isArray(paths)) {
            this.emit('import', [sheet, toArray(paths).map(path => String(path))]);
          } else if (__DEV__) {
            throw new Error('@import must be a string or an array of strings.');
          }

          break;
        }

        case '@keyframes': {
          const frames = globalSheet[rule] || {};

          if (__DEV__) {
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
            this.emit(rule.slice(1) as 'viewport', [
              sheet,
              this.convertRuleset(style, sheet.createRuleset(rule)),
            ]);
          } else if (__DEV__) {
            throw new Error(`${rule} must be a ruleset object.`);
          }

          break;
        } */

        default: {
          if (__DEV__) {
            throw new Error(
              `Unknown property "${rule}". Only at-rules are allowed in the global style sheet.`,
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
  convertStyleSheet(styleSheet: StyleSheet, options: TransformOptions): Sheet<NativeBlock> {
    const sheet = new Sheet<NativeBlock>(options);

    Object.keys(styleSheet).forEach(selector => {
      const ruleset = styleSheet[selector];

      if (!ruleset) {
        return;
      }

      // At-rule
      if (selector.charAt(0) === '@') {
        if (__DEV__) {
          throw new SyntaxError(`At-rules may not be defined in the root, found "${selector}".`);
        }

        // Class name or raw CSS
      } else if (typeof ruleset === 'string') {
        if (ruleset.match(CLASS_NAME)) {
          sheet.addClassName(selector, ruleset);
        } else {
          sheet.addClassName(selector, this.convertRawCss(sheet, selector, ruleset));
        }

        // Style object
      } else if (isObject(ruleset)) {
        sheet.addRuleset(this.convertRuleset(ruleset, sheet.createRuleset(selector)));

        // Unknown
      } else if (__DEV__) {
        throw new Error(`Invalid ruleset for "${selector}". Must be an object or class name.`);
      }
    });

    return sheet;
  }

  /**
   * Convert a pseudo CSS declaration block to raw CSS using Stylis.
   * Emit the raw CSS so that adapters can inject it into the DOM.
   */
  convertRawCss(sheet: Sheet<NativeBlock>, selector: string, declaration: string): ClassName {
    const styleName = sheet.options.name!;
    const className = `${styleName}-${selector}`;
    const stylis = new Stylis({
      compress: !__DEV__,
      global: false,
      keyframe: true,
      prefix: true,
    });

    if (isRTL(sheet.options.dir)) {
      stylis.use(rtlPlugin);
    }

    this.emit('css', [stylis(`.${className}`, declaration.trim()), className]);

    return className;
  }

  /**
   * Convert a ruleset including local at-rules, blocks, and properties.
   */
  convertRuleset(
    unifiedRuleset: ComponentBlock,
    ruleset: Ruleset<NativeBlock>,
  ): Ruleset<NativeBlock> {
    if (__DEV__) {
      if (!isObject(unifiedRuleset)) {
        throw new TypeError('Ruleset must be an object of properties.');
      }
    }

    const atRules: string[] = [];

    /* Object.keys(unifiedRuleset).forEach(baseKey => {
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
    }); */

    // Process at-rule's after properties, as some at-rule's may require
    // a property or nested value to exist before modifying it.
    atRules.forEach(key => {
      switch (key) {
        case '@fallbacks': {
          const fallbacks = unifiedRuleset[key] || {};

          if (__DEV__) {
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

          if (__DEV__) {
            if (!isObject(styles)) {
              throw new Error(`${key} must be an object of queries to rulesets.`);
            }
          }

          Object.keys(styles).forEach(query => {
            if (isObject(styles[query])) {
              const event = key === '@media' ? 'media' : 'support';

              this.emit(event as 'media', [
                ruleset,
                query,
                this.convertRuleset(styles[query], ruleset.createRuleset(`${key} ${query}`)),
              ]);
            } else if (__DEV__) {
              throw new Error(`${key} ${query} must be a mapping of conditions to style objects.`);
            }
          });

          break;
        }

        case '@selectors': {
          const selectors = unifiedRuleset[key] || {};

          if (__DEV__) {
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
          if (__DEV__) {
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
    if (__DEV__) {
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

      this.emit(type as 'selector', [
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
  emit(
    eventName: 'attribute' | 'media' | 'pseudo' | 'selector' | 'support',
    args: [Ruleset<NativeBlock>, string, Ruleset<NativeBlock>],
  ): unknown;
  emit(eventName: 'charset', args: [Sheet<NativeBlock>, string]): unknown;
  emit(eventName: 'css', args: [string, string]): unknown;
  emit(eventName: 'fallback', args: [Ruleset<NativeBlock>, keyof NativeBlock, unknown[]]): unknown;
  emit(
    eventName: 'font-face',
    args: [Sheet<NativeBlock>, Ruleset<NativeBlock>[], string, string[][]],
  ): unknown;
  emit(eventName: 'global', args: [Sheet<NativeBlock>, string, Ruleset<NativeBlock>]): unknown;
  emit(eventName: 'import', args: [Sheet<NativeBlock>, string[]]): unknown;
  emit(eventName: 'keyframe', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>, string]): unknown;
  emit(eventName: 'page' | 'viewport', args: [Sheet<NativeBlock>, Ruleset<NativeBlock>]): unknown;
  emit(eventName: 'property', args: [Ruleset<NativeBlock>, keyof NativeBlock, unknown]): unknown;
  emit(
    eventName: 'property:animationName',
    args: [Ruleset<NativeBlock>, Properties['animationName']],
  ): unknown;
  emit(
    eventName: 'property:fontFamily',
    args: [Ruleset<NativeBlock>, Properties['fontFamily']],
  ): unknown;
  emit(eventName: string, args: unknown[]): unknown {
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
    eventName: 'attribute' | 'pseudo' | 'selector' | 'support',
    callback: (ruleset: Ruleset<NativeBlock>, name: string, value: Ruleset<NativeBlock>) => void,
  ): this;
  on(eventName: 'charset', callback: (sheet: Sheet<NativeBlock>, charset: string) => void): this;
  on(eventName: 'css', callback: (css: string, className: string) => void): this;
  on(
    eventName: 'fallback',
    callback: (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, values: unknown[]) => void,
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
    eventName: 'page' | 'viewport',
    callback: (sheet: Sheet<NativeBlock>, ruleset: Ruleset<NativeBlock>) => void,
  ): this;
  on(
    eventName: 'property',
    callback: (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: unknown) => void,
  ): this;
  on(
    eventName: 'property:animationName',
    callback: (ruleset: Ruleset<NativeBlock>, value: Properties['animationName']) => unknown,
  ): this;
  on(
    eventName: 'property:fontFamily',
    callback: (ruleset: Ruleset<NativeBlock>, value: Properties['fontFamily']) => unknown,
  ): this;
  on(eventName: string, callback: Handler): this {
    this.handlers[eventName] = callback;

    return this;
  }
}
