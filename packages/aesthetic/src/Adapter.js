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

const LOCAL = 'local';
const GLOBAL = 'global';
const AT_RULES = ['@font-face', '@keyframes', '@media'];

export default class Adapter {
  fontFaces: { [familyName: string]: CSSStyle } = {};
  keyframes: { [animationName: string]: CSSStyle } = {};
  mediaQueries: { [mediaQuery: string]: CSSStyle } = {};

  static LOCAL: string = LOCAL;
  static GLOBAL: string = GLOBAL;

  /**
   * Convert the unified syntax to adapter specific syntax
   * by extracting at-rules and applying conversions at each level.
   */
  convert(styleName: string, declarations: StyleDeclarations): StyleDeclarations {
    const adaptedDeclarations = {};

    Object.keys(declarations).forEach((setName: string) => {
      const declaration = declarations[setName];

      if (typeof declaration === 'string') {
        return;
      }

      // Extract global level at-rules
      if (setName.charAt(0) === '@') {
        this.extract(':root', setName, declaration, GLOBAL);

      // Apply conversion to property sets
      } else {
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
   * Extract at-rules from both the global and local levels.
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

      default:
        throw new SyntaxError(`Unsupported at-rule "${atRule}".`);
    }
  }

  /**
   * Extract font face at-rules.
   */
  extractFontFaces(setName: string, properties: CSSStyle, fromScope: string) {
    deepMerge(this.fontFaces, properties);
  }

  /**
   * Extract animation keyframes at-rules.
   */
  extractKeyframes(setName: string, properties: CSSStyle, fromScope: string) {
    deepMerge(this.keyframes, properties);
  }

  /**
   * Extract media query at-rules.
   */
  extractMediaQueries(setName: string, properties: CSSStyle, fromScope: string) {
    if (fromScope === GLOBAL) {
      throw new SyntaxError('Media queries must be defined locally to an element.');
    } else {
      deepMerge(this.mediaQueries[setName], properties);
    }
  }

  formatAtRules(type: string, properties: CSSStyle): CSSStyle {
    // Font faces do not have IDs in their declaration,
    // so we need to handle this differently.
    if (type === '@font-face') {
      const fonts = Object.keys(properties).map((key: string) => properties[key]);

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
   * Transform the style objects into a mapping of CSS class names.
   */
  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    return {};
  }
}
