/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */
import deepMerge from 'lodash.merge';

import type {
  StyleDeclarations,
  ClassNames,
  CSSStyle,
} from '../../types';

export const LOCAL = 'local';
export const GLOBAL = 'global';
export const AT_RULES = ['@font-face', '@keyframes', '@media', '@fallbacks'];

export default class Adapter {
  fallbacks: CSSStyle = {}; // Local
  fontFaces: CSSStyle = {}; // Global
  keyframes: CSSStyle = {}; // Global
  mediaQueries: CSSStyle = {}; // Local
  unifiedSyntax: boolean = true;

  static LOCAL: string = LOCAL;
  static GLOBAL: string = GLOBAL;

  /**
   * Disable unified syntax and rely on the adapter's native syntax.
   */
  disableUnifiedSyntax(): this {
    this.unifiedSyntax = false;

    return this;
  }

  /**
   * Convert the unified syntax to adapter specific syntax
   * by extracting at-rules and applying conversions at each level.
   */
  convert(styleName: string, declarations: StyleDeclarations): StyleDeclarations {
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

    return nextProperties;
  }

  /**
   * Extract at-rules and parser rules from both the global and local levels.
   */
  extract(setName: string, atRule: string, properties: CSSStyle, fromScope: string) {
    if (!properties || Array.isArray(properties) || typeof properties !== 'object') {
      throw new SyntaxError(`At-rule declaration "${atRule}" must be an object.`);
    }

    switch (atRule) {
      case '@font-face':
        this.extractFontFaces(setName, properties, fromScope);
        break;

      case '@keyframes':
        this.extractKeyframes(setName, properties, fromScope);
        break;

      case '@media':
        this.extractMediaQueries(setName, properties, fromScope);
        break;

      case '@fallbacks':
        this.extractFallbacks(setName, properties, fromScope);
        break;

      default:
        throw new SyntaxError(`Unsupported at-rule "${atRule}".`);
    }
  }

  /**
   * Extract property fallbacks.
   */
  extractFallbacks(setName: string, properties: CSSStyle, fromScope: string) {
    if (fromScope === GLOBAL) {
      throw new SyntaxError('Property fallbacks must be defined locally to an element.');
    }

    deepMerge(this.fallbacks, {
      [setName]: properties,
    });
  }

  /**
   * Extract font face at-rules.
   */
  extractFontFaces(setName: string, properties: CSSStyle, fromScope: string) {
    if (fromScope === LOCAL) {
      throw new SyntaxError('Font faces must be declared in the global scope.');
    }

    Object.keys(properties).forEach((name: string) => {
      // Use the family name so raw CSS can reference it
      // $FlowIssue We can assume it's an object
      const familyName = String(properties[name].fontFamily);

      if (this.fontFaces[familyName]) {
        throw new TypeError(`Font face "${familyName}" has already been defined.`);
      } else {
        this.fontFaces[familyName] = properties[name];
      }
    });
  }

  /**
   * Extract animation keyframes at-rules.
   */
  extractKeyframes(setName: string, properties: CSSStyle, fromScope: string) {
    if (fromScope === LOCAL) {
      throw new SyntaxError('Animation keyframes must be declared in the global scope.');
    }

    Object.keys(properties).forEach((name: string) => {
      if (this.keyframes[name]) {
        throw new TypeError(`Animation keyframe "${name}" has already been defined.`);
      } else {
        this.keyframes[name] = properties[name];
      }
    });
  }

  /**
   * Extract media query at-rules.
   */
  extractMediaQueries(setName: string, properties: CSSStyle, fromScope: string) {
    if (fromScope === GLOBAL) {
      throw new SyntaxError('Media queries must be defined locally to an element.');
    }

    deepMerge(this.mediaQueries, {
      [setName]: properties,
    });
  }

  /**
   * Format an at-rule object into it's native CSS-in-JS structure.
   */
  formatAtRules(type: string, properties: CSSStyle): CSSStyle {
    // Font faces do not have IDs in their declaration,
    // so we need to handle this differently.
    if (type === '@font-face') {
      const fonts = Object.keys(properties).map(key => properties[key]);

      return {
        // $FlowIssue Make an exception for arrays in this case
        '@font-face': fonts.length ? fonts : fonts[0],
      };
    }

    const rules = {};

    Object.keys(properties).forEach((id: string) => {
      rules[`${type} ${id}`] = properties[id];
    });

    return rules;
  }

  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    // Reset local cache between each transform
    this.fallbacks = {};
    this.mediaQueries = {};

    // Convert to native adapter syntax
    const nativeDeclarations = this.unifiedSyntax
      ? this.convert(styleName, declarations)
      : declarations;

    return this.transformStyles(styleName, nativeDeclarations);
  }

  /**
   * Transform the style objects into a mapping of CSS class names.
   */
  transformStyles(styleName: string, declarations: StyleDeclarations): ClassNames {
    throw new Error(`${this.constructor.name} must define the \`transformStyles\` method.`);
  }
}
