/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './utils/isObject';

import type { StyleDeclarationMap, CSSStyle, AtRuleSet, AtRuleMap, AtRuleCache, EventCallback, FallbackMap } from './types';

export const LOCAL = 'local';
export const GLOBAL = 'global';
export const AT_RULES = ['@fallbacks', '@font-face', '@keyframes', '@media'];

export default class UnifiedSyntax {
  events: { [eventName: string]: EventCallback } = {};
  fallbacks: FallbackMap = {}; // Local
  fontFaces: AtRuleMap = {}; // Global
  fontFaceNames: AtRuleCache = {};
  keyframes: AtRuleMap = {}; // Global
  keyframeNames: AtRuleCache = {};
  mediaQueries: AtRuleSet = {}; // Local
  styleTag: ?HTMLElement = null;

  static LOCAL: string = LOCAL;
  static GLOBAL: string = GLOBAL;

  /**
   * Convert the unified syntax to adapter specific syntax
   * by extracting at-rules and applying conversions at each level.
   */
  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
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
    Object.keys(adaptedDeclarations).forEach((setName: string) => {
      const declaration = declarations[setName];

      if (typeof declaration !== 'string') {
        adaptedDeclarations[setName] = this.convertDeclaration(setName, declaration);
      }
    });

    this.emit('converted');

    return adaptedDeclarations;
  }

  /**
   * Convert an object of properties by extracting local at-rules
   * and parsing fallbacks.
   */
  convertDeclaration(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = { ...properties };

    AT_RULES.forEach((atRule: string) => {
      if (atRule in nextProperties) {
        this.extract(setName, atRule, nextProperties[atRule], LOCAL);

        delete nextProperties[atRule];
      }
    });

    this.emit('declaration', [setName, nextProperties]);

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
  // eslint-disable-next-line flowtype/no-weak-types
  extract(setName: string, atRule: string, rules: any, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (!isObject(rules)) {
        throw new SyntaxError(`At-rule declaration "${atRule}" must be an object.`);
      }
    }

    switch (atRule) {
      case '@fallbacks':
        this.extractFallbacks(setName, (rules: CSSStyle), fromScope);
        break;

      case '@font-face':
        this.extractFontFaces(setName, (rules: AtRuleMap), fromScope);
        break;

      case '@keyframes':
        this.extractKeyframes(setName, (rules: AtRuleMap), fromScope);
        break;

      case '@media':
        this.extractMediaQueries(setName, (rules: AtRuleMap), fromScope);
        break;

      default: {
        if (process.env.NODE_ENV === 'development') {
          throw new SyntaxError(`Unsupported at-rule "${atRule}".`);
        }
      }
    }
  }

  /**
   * Extract property fallbacks.
   */
  extractFallbacks(setName: string, properties: CSSStyle, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === GLOBAL) {
        throw new SyntaxError('Property fallbacks must be defined locally to an element.');
      }
    }

    this.fallbacks[setName] = properties;

    this.emit('fallback', [setName, properties]);
  }

  /**
   * Extract font face at-rules.
   */
  extractFontFaces(setName: string, rules: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === LOCAL) {
        throw new SyntaxError('Font faces must be declared in the global scope.');
      }
    }

    Object.keys(rules).forEach((name: string) => {
      // Use the family name so raw CSS can reference it
      const familyName = String(rules[name].fontFamily);

      if (this.fontFaces[familyName]) {
        if (process.env.NODE_ENV === 'development') {
          throw new TypeError(`Font face "${familyName}" has already been defined.`);
        }
      } else {
        this.fontFaces[familyName] = rules[name];
      }

      this.emit('fontFace', [setName, familyName, rules[name]]);
    });
  }

  /**
   * Extract animation keyframes at-rules.
   */
  extractKeyframes(setName: string, rules: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === LOCAL) {
        throw new SyntaxError('Animation keyframes must be declared in the global scope.');
      }
    }

    Object.keys(rules).forEach((name: string) => {
      if (this.keyframes[name]) {
        if (process.env.NODE_ENV === 'development') {
          throw new TypeError(`Animation keyframe "${name}" has already been defined.`);
        }
      } else {
        this.keyframes[name] = rules[name];
      }

      this.emit('keyframe', [setName, name, rules[name]]);
    });
  }

  /**
   * Extract media query at-rules.
   */
  extractMediaQueries(setName: string, rules: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === GLOBAL) {
        throw new SyntaxError('Media queries must be defined locally to an element.');
      }
    }

    this.mediaQueries[setName] = rules;

    Object.keys(rules).forEach((query: string) => {
      this.emit('mediaQuery', [setName, query, rules[query]]);
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
