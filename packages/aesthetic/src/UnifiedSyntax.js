/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import { toArray } from 'aesthetic-utils';

import type {
  AtRule,
  AtRuleConfig,
  AtRuleFormatter,
  EventCallback,
  Fallbacks,
  FontFaces,
  // Keyframes,
  // MediaQueries,
  StyleDeclaration,
  Statement,
  // Supports,
} from '../../types';

export default class UnifiedSyntax {
  events: { [eventName: string]: EventCallback } = {};

  globalRules: { [rule: string]: AtRuleConfig } = {};

  localRules: { [rule: string]: AtRuleConfig } = {};

  constructor() {
    this
      .addLocalRule('@fallbacks', this.formatFallbacks)
      .addLocalRule('@media', this.formatBlock, true)
      .addLocalRule('@supports', this.formatBlock, true)
      .addGlobalRule('@charset', this.formatInline)
      .addGlobalRule('@document', this.formatBlock, true)
      .addGlobalRule('@font-face', this.formatFontFace, true)
      .addGlobalRule('@import', this.formatInline)
      .addGlobalRule('@keyframes', this.formatBlock, true)
      .addGlobalRule('@namespace', this.formatInline)
      .addGlobalRule('@page', this.formatBlock)
      .addGlobalRule('@viewport', this.formatBlock);
  }

  /**
   * Add a global at-rule.
   */
  addGlobalRule(rule: AtRule, format: AtRuleFormatter, nested?: boolean = false): this {
    this.globalRules[rule] = {
      cache: {},
      format,
      nested,
      rule,
    };

    return this;
  }

  /**
   * Add a global at-rule.
   */
  addLocalRule(rule: AtRule, format: AtRuleFormatter, nested?: boolean = false): this {
    this.localRules[rule] = {
      cache: {},
      format,
      nested,
      rule,
    };

    return this;
  }

  /**
   * Format and verify a value is a style declaration object.
   */
  formatBlock<T: Object>(rule: AtRule, value: T): T {
    if (!value || typeof value !== 'object') {
      throw new TypeError(`Invalid type for "${rule}", must be a style object.`);
    }

    return value;
  }

  /**
   * Format each fallback value into an array of possible values for each property.
   */
  formatFallbacks<T: Object>(rule: AtRule, value: T): T {
    const fallbacks = {};

    Object.keys(this.formatBlock(rule, value)).forEach((key) => {
      fallbacks[key] = toArray(value[key]);
    });

    return fallbacks;
  }

  /**
   * Format each font face into an array of variations for each font family.
   */
  formatFontFace<T: Object>(rule: AtRule, value: T): FontFaces {
    const fontFaces = {};

    Object.keys(this.formatBlock(rule, value)).forEach((key) => {
      fontFaces[key] = toArray(value[key]).map(font => ({
        ...font,
        fontFamily: key,
      }));
    });

    return fontFaces;
  }

  /**
   * Format an inline value as a string. These are usually paths and single values.
   */
  formatInline<T>(rule: AtRule, value: T): string {
    return String(value);
  }

  /**
   * Convert the unified syntax to adapter specific syntax
   * by extracting at-rules and applying conversions at each selector level.
   */
  convert(statement: Statement): Statement {
    const nextDeclarations = {};

    // Verify there are no local at-rules
    if (__DEV__) {
      Object.keys(this.localRules).forEach((rule) => {
        if (statement[rule]) {
          throw new SyntaxError(`${rule} must be defined local within a selector.`);
        }
      });
    }

    // Convert global at-rules and selectors
    Object.keys(statement).forEach((selector) => {
      const declaration = statement[selector];
      let value = {};

      // At-rule
      if (selector.charAt(0) === '@') {
        if (this.globalRules[selector]) {
          this.convertRule(this.globalRules[selector], declaration, nextDeclarations);
        } else if (__DEV__) {
          throw new SyntaxError(`Unsupported at-rule "${selector}".`);
        }

      // Class name
      } else if (typeof declaration === 'string') {
        value = declaration;

      // Style object
      } else if (typeof declaration === 'object') {
        value = this.convertDeclaration(selector, declaration);

      } else if (__DEV__) {
        throw new Error(`Invalid style declaration for "${selector}".`);
      }

      nextDeclarations[selector] = value;
    });

    return nextDeclarations;
  }

  /**
   * Convert a style declaration including local at-rules and properties.
   */
  convertDeclaration(selector: string, declaration: StyleDeclaration): StyleDeclaration {
    const nextDeclaration = {};

    // Verify there are no global at-rules
    if (__DEV__) {
      Object.keys(this.globalRules).forEach((rule) => {
        if (declaration[rule]) {
          throw new SyntaxError(`${rule} must be defined in the global scope.`);
        }
      });
    }

    // Convert global at-rules and selectors
    Object.keys(declaration).forEach((key) => {
      // At-rule
      if (key.charAt(0) === '@') {
        if (this.localRules[key]) {
          this.convertRule(this.localRules[key], declaration[key], nextDeclaration);
        } else if (__DEV__) {
          throw new SyntaxError(`Unsupported at-rule "${key}".`);
        }

      // Property
      } else {
        this.emit('property', [nextDeclaration, declaration[key], key]);
      }
    });

    return nextDeclaration;
  }

  /**
   * Convert an at-rule based on its config.
   */
  convertRule(config: AtRuleConfig, value: *, declaration: *) {
    if (config.nested) {
      Object.keys(value).forEach((key) => {
        if (config.cache[key]) {
          throw new Error(`${config.rule} property "${key} has already been defined."`);
        }

        this.emit(config.rule, [declaration, value[key], key]);

        config.cache[key] = true;
      });
    } else {
      this.emit(config.rule, [declaration, value]);
    }
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
}
