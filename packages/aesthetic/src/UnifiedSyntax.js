/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { isObject } from 'aesthetic-utils';

import type {
  AtRuleCache,
  EventCallback,
  Fallbacks,
  FontFaces,
  Keyframes,
  MediaQueries,
  SelectorMap,
  StyleDeclaration,
  StyleDeclarations,
} from '../../types';

export const LOCAL = 'local';
export const GLOBAL = 'global';
export const AT_RULES = ['@fallbacks', '@font-face', '@keyframes', '@media'];

export default class UnifiedSyntax {
  events: { [eventName: string]: EventCallback } = {};

  // Local
  fallbacks: SelectorMap<Fallbacks> = {};

  // Global
  fontFaces: FontFaces = {};

  fontFacesCache: AtRuleCache<string[]> = {};

  // Global
  keyframes: Keyframes = {};

  keyframesCache: AtRuleCache<string> = {};

  // Local
  mediaQueries: SelectorMap<MediaQueries> = {};

  static LOCAL: string = LOCAL;

  static GLOBAL: string = GLOBAL;

  /**
   * Convert the unified syntax to adapter specific syntax
   * by extracting at-rules and applying conversions at each level.
   */
  convert(declarations: StyleDeclarations): StyleDeclarations {
    this.resetLocalCache();
    this.emit('converting');

    const adaptedDeclarations = { ...declarations };

    // Extract at-rules first so that they are available for properties
    AT_RULES.forEach((atRule: string) => {
      if (atRule in adaptedDeclarations) {
        this.extract(':root', atRule, adaptedDeclarations[atRule], GLOBAL);

        delete adaptedDeclarations[atRule];
      }
    });

    // Apply conversion to properties
    Object.keys(adaptedDeclarations).forEach((selector) => {
      const declaration = declarations[selector];

      if (typeof declaration !== 'string') {
        adaptedDeclarations[selector] = this.convertDeclaration(selector, declaration);
      }
    });

    this.emit('converted');

    return adaptedDeclarations;
  }

  /**
   * Convert an object of properties by extracting local at-rules
   * and parsing fallbacks.
   */
  convertDeclaration(selector: string, properties: StyleDeclaration): StyleDeclaration {
    const nextProperties = { ...properties };

    AT_RULES.forEach((atRule) => {
      if (atRule in nextProperties) {
        this.extract(selector, atRule, nextProperties[atRule], LOCAL);

        delete nextProperties[atRule];
      }
    });

    this.emit('declaration', [selector, nextProperties]);

    return nextProperties;
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: string, args: *[] = []): this {
    if (this.events[eventName]) {
      this.events[eventName](...args);
    }

    return this;
  }

  /**
   * Extract at-rules and parser rules from both the global and local levels.
   */
  extract(selector: string, atRule: string, rules: *, fromScope: string) {
    if (__DEV__) {
      if (!isObject(rules)) {
        throw new SyntaxError(`At-rule declaration "${atRule}" must be an object.`);
      }
    }

    switch (atRule) {
      case '@fallbacks':
        this.extractFallbacks(selector, (rules: Fallbacks), fromScope);
        break;

      case '@font-face':
        this.extractFontFaces(selector, (rules: FontFaces), fromScope);
        break;

      case '@keyframes':
        this.extractKeyframes(selector, (rules: Keyframes), fromScope);
        break;

      case '@media':
        this.extractMediaQueries(selector, (rules: MediaQueries), fromScope);
        break;

      default: {
        if (__DEV__) {
          throw new SyntaxError(`Unsupported at-rule "${atRule}".`);
        }
      }
    }
  }

  /**
   * Extract property fallbacks.
   */
  extractFallbacks(selector: string, properties: Fallbacks, fromScope: string) {
    if (__DEV__) {
      if (fromScope === GLOBAL) {
        throw new SyntaxError('Property fallbacks must be defined locally to an element.');
      }
    }

    this.fallbacks[selector] = properties;

    this.emit('fallback', [selector, properties]);
  }

  /**
   * Extract font face at-rules.
   */
  extractFontFaces(selector: string, rules: FontFaces, fromScope: string) {
    if (__DEV__) {
      if (fromScope === LOCAL) {
        throw new SyntaxError('Font faces must be declared in the global scope.');
      }
    }

    Object.keys(rules).forEach((name) => {
      if (this.fontFaces[name]) {
        if (__DEV__) {
          throw new TypeError(`Font face "${name}" has already been defined.`);
        }
      } else {
        const fonts = Array.isArray(rules[name]) ? rules[name] : [rules[name]];

        this.fontFaces[name] = fonts.map(font => ({
          ...font,
          fontFamily: name,
        }));
      }

      this.emit('fontFace', [selector, name, this.fontFaces[name]]);
    });
  }

  /**
   * Extract animation keyframes at-rules.
   */
  extractKeyframes(selector: string, rules: Keyframes, fromScope: string) {
    if (__DEV__) {
      if (fromScope === LOCAL) {
        throw new SyntaxError('Animation keyframes must be declared in the global scope.');
      }
    }

    Object.keys(rules).forEach((name) => {
      if (this.keyframes[name]) {
        if (__DEV__) {
          throw new TypeError(`Animation keyframe "${name}" has already been defined.`);
        }
      } else {
        this.keyframes[name] = rules[name];
      }

      this.emit('keyframe', [selector, name, rules[name]]);
    });
  }

  /**
   * Extract media query at-rules.
   */
  extractMediaQueries(selector: string, rules: MediaQueries, fromScope: string) {
    if (__DEV__) {
      if (fromScope === GLOBAL) {
        throw new SyntaxError('Media queries must be defined locally to an element.');
      }
    }

    this.mediaQueries[selector] = rules;

    Object.keys(rules).forEach((query: string) => {
      this.emit('mediaQuery', [selector, query, rules[query]]);
    });
  }

  /**
   * Delete an event listener.
   */
  off(eventName: string): this {
    delete this.events[eventName];

    return this;
  }

  /**
   * Register an event listener.
   */
  on(eventName: string, callback: EventCallback): this {
    this.events[eventName] = callback;

    return this;
  }

  /**
   * Reset cached global at-rules.
   */
  resetGlobalCache() {
    this.fontFaces = {};
    this.keyframes = {};
  }

  /**
   * Reset cached local at-rules.
   */
  resetLocalCache() {
    this.fallbacks = {};
    this.mediaQueries = {};
  }
}
