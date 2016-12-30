/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type {
  StyleDeclarations,
  ClassNames,
  CSSStyle,
  AtRules,
} from '../../types';

export const LOCAL = 'local';
export const GLOBAL = 'global';
export const AT_RULES = ['@fallbacks', '@font-face', '@keyframes', '@media'];

export default class Adapter {
  fallbacks: AtRules = {}; // Local
  fontFaces: AtRules = {}; // Global
  keyframes: AtRules = {}; // Global
  mediaQueries: AtRules = {}; // Local
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
    if (!this.unifiedSyntax) {
      return declarations;
    }

    this.onConvertStart();

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

    this.onConvertStop();

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
  extract(setName: string, atRule: string, properties: AtRules, fromScope: string) {
    if (!properties || Array.isArray(properties) || typeof properties !== 'object') {
      throw new SyntaxError(`At-rule declaration "${atRule}" must be an object.`);
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

      default:
        throw new SyntaxError(`Unsupported at-rule "${atRule}".`);
    }
  }

  /**
   * Extract property fallbacks.
   */
  extractFallbacks(setName: string, properties: AtRules, fromScope: string) {
    if (fromScope === GLOBAL) {
      throw new SyntaxError('Property fallbacks must be defined locally to an element.');
    }

    Object.keys(properties).forEach((propName: string) => {
      if (!this.fallbacks[setName]) {
        this.fallbacks[setName] = {};
      }

      this.fallbacks[setName][propName] = properties[propName];

      this.onExtractedFallback(setName, propName, properties[propName]);
    });
  }

  /**
   * Extract font face at-rules.
   */
  extractFontFaces(setName: string, properties: AtRules, fromScope: string) {
    if (fromScope === LOCAL) {
      throw new SyntaxError('Font faces must be declared in the global scope.');
    }

    Object.keys(properties).forEach((name: string) => {
      // Use the family name so raw CSS can reference it
      const familyName = String(properties[name].fontFamily);

      if (this.fontFaces[familyName]) {
        throw new TypeError(`Font face "${familyName}" has already been defined.`);
      } else {
        this.fontFaces[familyName] = properties[name];
      }

      this.onExtractedFontFace(setName, familyName, properties[name]);
    });
  }

  /**
   * Extract animation keyframes at-rules.
   */
  extractKeyframes(setName: string, properties: AtRules, fromScope: string) {
    if (fromScope === LOCAL) {
      throw new SyntaxError('Animation keyframes must be declared in the global scope.');
    }

    Object.keys(properties).forEach((name: string) => {
      if (this.keyframes[name]) {
        throw new TypeError(`Animation keyframe "${name}" has already been defined.`);
      } else {
        this.keyframes[name] = properties[name];
      }

      this.onExtractedKeyframes(setName, name, properties[name]);
    });
  }

  /**
   * Extract media query at-rules.
   */
  extractMediaQueries(setName: string, properties: AtRules, fromScope: string) {
    if (fromScope === GLOBAL) {
      throw new SyntaxError('Media queries must be defined locally to an element.');
    }

    Object.keys(properties).forEach((query: string) => {
      if (!this.mediaQueries[setName]) {
        this.mediaQueries[setName] = {};
      }

      this.mediaQueries[setName][query] = properties[query];

      this.onExtractedMediaQuery(setName, query, properties[query]);
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

      if (!fonts.length) {
        return {};
      }

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
   * Callback triggered when conversion starts.
   */
  onConvertStart() {}

  /**
   * Callback triggered when conversion stops.
   */
  onConvertStop() {}

  /**
   * Callback triggered when a fallback is found.
   */
  onExtractedFallback(setName: string, propName: string, properties: CSSStyle) {}

  /**
   * Callback triggered when a font face is found.
   */
  onExtractedFontFace(setName: string, familyName: string, properties: CSSStyle) {}

  /**
   * Callback triggered when an animation keyframes is found.
   */
  onExtractedKeyframes(setName: string, animationName: string, properties: CSSStyle) {}

  /**
   * Callback triggered when a media query is found.
   */
  onExtractedMediaQuery(setName: string, mediaQuery: string, properties: CSSStyle) {}

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

  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    // Reset local cache between each transform
    this.resetLocalCache();

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
