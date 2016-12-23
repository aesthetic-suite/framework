/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */
import deepMerge from 'lodash.merge';

import type { StyleDeclarations, ClassNames, CSSStyle, CSSStyleValue } from '../../types';

const LOCAL = 'local';
const GLOBAL = 'global';
const AT_RULE_PATTERN = /^(@[-a-z+]) (.*?)$/;

export default class Adapter {
  fontFaces: { [key: string]: CSSStyle } = {};
  keyframes: { [key: string]: CSSStyle } = {};
  mediaQueries: { [key: string]: CSSStyle } = {};
  multipleStyleDeclarations: boolean = true;
  pseudoPrefix: string = '';

  static LOCAL: string = LOCAL;
  static GLOBAL: string = GLOBAL;

  convert(styleName: string, declarations: StyleDeclarations): StyleDeclarations {
    const adaptedDeclarations = {};

    Object.keys(declarations).forEach((setName: string) => {
      const setDecl = declarations[setName];

      // Skip any declarations that are being used as class names
      if (typeof setDecl === 'string') {
        return;
      }

      // At-rules at the global level
      if (setName.charAt(0) === '@') {
        if (Array.isArray(setDecl)) {
          throw new Error(`At-rule declaration "${setName}" cannot be an array.`);
        }

        this.convertAtRule(setName, setDecl, GLOBAL);

      // Set declarations
      } else {
        const setDecls = (Array.isArray(setDecl) ? setDecl : [setDecl])
          .map(this.convertProperties);

        if (this.multipleStyleDeclarations) {
          adaptedDeclarations[setName] = setDecls;
        } else {
          adaptedDeclarations[setName] = deepMerge(...setDecls);
        }
      }
    });

    return adaptedDeclarations;
  }

  convertAtRule(atRule: string, properties: CSSStyle, fromScope: string): CSSStyle {
    const match = atRule.match(AT_RULE_PATTERN);

    if (!match) {
      throw new SyntaxError(`Invalid at-rule detected for "${atRule}".`);
    }

    const [, type, name] = match;

    if (!name && type !== '@font-face') {
      throw new SyntaxError(`Missing at-rule identifier for "${atRule}".`);
    }

    switch (type) {
      case '@font-face':
        return this.extractFontFace(String(properties.fontFamily), properties, fromScope);

      case '@keyframes':
        return this.extractKeyframes(name, properties, fromScope);

      case '@media':
        return this.extractMediaQuery(name, properties, fromScope);

      default:
        throw new SyntaxError(`Unsupported at-rule "${atRule}".`);
    }
  }

  convertProperties(properties: CSSStyle): CSSStyle {
    const nextProperties = {};
    let fallbacks = {};

    // Extract fallbacks first so that we can reference them
    if (typeof properties.fallbacks === 'object') {
      fallbacks = properties.fallbacks;
    }

    Object.keys(properties).forEach((propName: string) => {
      const propValue = (properties[propName]: CSSStyle);

      // Pseudos
      if (propName.charAt(0) === ':') {
        nextProperties[`${this.pseudoPrefix}${propName}`] = this.convertProperties(propValue);

      // At-rules
      } else if (propName.charAt(0) === '@') {
        nextProperties[propName] = this.convertAtRule(propName, propValue, LOCAL);

      // Standard
      } else {
        nextProperties[propName] = this.convertPropertyValue(propName, (propValue: CSSStyleValue));
      }
    });

    return nextProperties;
  }

  convertPropertyValue(name: string, value: CSSStyleValue): CSSStyleValue {
    return value;
  }

  extractFontFace(family: string, properties: CSSStyle, fromScope: string): CSSStyle {
    if (fromScope === GLOBAL) {
      this.fontFaces[family] = properties;
    } else {
      throw new SyntaxError('Font faces must be defined at the global level.');
    }

    return properties;
  }

  extractKeyframes(name: string, properties: CSSStyle, fromScope: string): CSSStyle {
    if (fromScope === GLOBAL) {
      this.keyframes[name] = properties;
    } else {
      throw new SyntaxError('Animation keyframes must be defined at the global level.');
    }

    return properties;
  }

  extractMediaQuery(query: string, properties: CSSStyle, fromScope: string): CSSStyle {
    if (fromScope === GLOBAL) {
      throw new SyntaxError('Media queries must be defined locally to an element.');
    }

    return properties;
  }

  /**
   * Transform the style objects into a mapping of CSS class names.
   */
  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    return {};
  }
}
