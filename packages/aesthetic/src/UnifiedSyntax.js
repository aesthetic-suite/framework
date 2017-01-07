/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './helpers/isObject';

import type { StyleDeclarationMap, CSSStyle, AtRuleMap } from 'aesthetic';

type EventListener =
  () => void |
  (setName: string, properties: CSSStyle) => void;

export const LOCAL = 'local';
export const GLOBAL = 'global';
export const AT_RULES = ['@fallbacks', '@font-face', '@keyframes', '@media'];

export class UnifiedSyntax {
  events: { [eventName: string]: EventListener } = {};
  fallbacks: AtRuleMap = {}; // Local
  fontFaces: AtRuleMap = {}; // Global
  fontFaceNames: { [fontFamily: string]: string } = {};
  keyframes: AtRuleMap = {}; // Global
  keyframeNames: { [animationName: string]: string } = {};
  mediaQueries: AtRuleMap = {}; // Local
  styleTag: ?HTMLElement = null;

  static LOCAL: string = LOCAL;
  static GLOBAL: string = GLOBAL;

  /**
   * Convert the unified syntax to adapter specific syntax
   * by extracting at-rules and applying conversions at each level.
   */
  convert(styleName: string, declarations: StyleDeclarationMap): StyleDeclarationMap {
    this.resetLocalCache();
    this.emit('start');

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
        adaptedDeclarations[setName] = this.convertProperties(setName, declaration);
      }
    });

    this.emit('stop');

    return adaptedDeclarations;
  }

  /**
   * Convert an object of properties by extracting local at-rules
   * and parsing fallbacks.
   */
  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = { ...properties };

    AT_RULES.forEach((atRule: string) => {
      if (atRule in nextProperties) {
        this.extract(setName, atRule, nextProperties[atRule], LOCAL);

        delete nextProperties[atRule];
      }
    });

    this.emit('properties', [setName, nextProperties]);

    return nextProperties;
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: string, args: mixed[] = []): this {
    if (this.events[eventName]) {
      this.events[eventName](...args);
    }

    return this;
  }

  /**
   * Extract at-rules and parser rules from both the global and local levels.
   */
  extract(setName: string, atRule: string, properties: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (!isObject(properties)) {
        throw new SyntaxError(`At-rule declaration "${atRule}" must be an object.`);
      }
    }

    switch (atRule) {
      case '@fallbacks':
        this.extractFallbacks(setName, properties, fromScope);
        break;

      case '@font-face':
        this.extractFontFaces(setName, properties, fromScope);
        break;

      case '@keyframes':
        this.extractKeyframes(setName, properties, fromScope);
        break;

      case '@media':
        this.extractMediaQueries(setName, properties, fromScope);
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
  extractFallbacks(setName: string, properties: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === GLOBAL) {
        throw new SyntaxError('Property fallbacks must be defined locally to an element.');
      }
    }

    Object.keys(properties).forEach((propName: string) => {
      if (!this.fallbacks[setName]) {
        this.fallbacks[setName] = {};
      }

      this.fallbacks[setName][propName] = properties[propName];

      this.emit('fallback', [setName, propName, properties[propName]]);
    });
  }

  /**
   * Extract font face at-rules.
   */
  extractFontFaces(setName: string, properties: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === LOCAL) {
        throw new SyntaxError('Font faces must be declared in the global scope.');
      }
    }

    Object.keys(properties).forEach((name: string) => {
      // Use the family name so raw CSS can reference it
      const familyName = String(properties[name].fontFamily);

      if (this.fontFaces[familyName]) {
        if (process.env.NODE_ENV === 'development') {
          throw new TypeError(`Font face "${familyName}" has already been defined.`);
        }
      } else {
        this.fontFaces[familyName] = properties[name];
      }

      this.emit('fontface', [setName, familyName, properties[name]]);
    });
  }

  /**
   * Extract animation keyframes at-rules.
   */
  extractKeyframes(setName: string, properties: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === LOCAL) {
        throw new SyntaxError('Animation keyframes must be declared in the global scope.');
      }
    }

    Object.keys(properties).forEach((name: string) => {
      if (this.keyframes[name]) {
        if (process.env.NODE_ENV === 'development') {
          throw new TypeError(`Animation keyframe "${name}" has already been defined.`);
        }
      } else {
        this.keyframes[name] = properties[name];
      }

      this.emit('keyframe', [setName, name, properties[name]]);
    });
  }

  /**
   * Extract media query at-rules.
   */
  extractMediaQueries(setName: string, properties: AtRuleMap, fromScope: string) {
    if (process.env.NODE_ENV === 'development') {
      if (fromScope === GLOBAL) {
        throw new SyntaxError('Media queries must be defined locally to an element.');
      }
    }

    Object.keys(properties).forEach((query: string) => {
      if (!this.mediaQueries[setName]) {
        this.mediaQueries[setName] = {};
      }

      this.mediaQueries[setName][query] = properties[query];

      this.emit('mediaquery', [setName, query, properties[query]]);
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
  on(eventName: string, func: EventListener): this {
    this.events[eventName] = func;

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
