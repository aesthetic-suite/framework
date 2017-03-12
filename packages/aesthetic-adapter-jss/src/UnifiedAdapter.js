/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import JSS from 'jss';
import UnifiedSyntax from '../../aesthetic/unified';
import { injectAtRules, toArray } from '../../aesthetic-utils';
import JSSAdapter from './NativeAdapter';

import type { StyleDeclarationMap, TransformedStylesMap, AtRuleMap, CSSStyle } from '../../types';

export default class UnifiedJSSAdapter extends JSSAdapter {
  currentFontFaces: AtRuleMap = {};
  currentKeyframes: AtRuleMap = {};
  currentMediaQueries: AtRuleMap = {};
  syntax: UnifiedSyntax;

  constructor(jss: JSS, options: Object = {}) {
    super(jss, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('converting', this.onConverting)
      .on('declaration', this.onDeclaration)
      .on('fontFace', this.onFontFace)
      .on('keyframe', this.onKeyframe)
      .on('mediaQuery', this.onMediaQuery);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    const adaptedDeclarations = this.syntax.convert(declarations);
    const globalAtRules = ({}: CSSStyle);

    injectAtRules(globalAtRules, '@font-face', this.currentFontFaces);
    injectAtRules(globalAtRules, '@keyframes', this.currentKeyframes);
    injectAtRules(globalAtRules, '@media', this.currentMediaQueries);

    return {
      ...globalAtRules,
      ...adaptedDeclarations,
    };
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    return super.transform(styleName, this.convert(declarations));
  }

  onConverting = () => {
    this.currentFontFaces = {};
    this.currentKeyframes = {};
    this.currentMediaQueries = {};
  };

  onDeclaration = (setName: string, properties: CSSStyle) => {
    // Prepend pseudos with an ampersand
    Object.keys(properties).forEach((propName: string) => {
      if (propName.charAt(0) === ':') {
        properties[`&${propName}`] = properties[propName];

        delete properties[propName];
      }
    });

    // Fallbacks
    if (this.syntax.fallbacks[setName]) {
      const fallbacks = [];

      Object.keys(this.syntax.fallbacks[setName]).forEach((propName: string) => {
        toArray(this.syntax.fallbacks[setName][propName]).forEach((propValue: *) => {
          fallbacks.push({ [propName]: propValue });
        });
      });

      properties.fallbacks = fallbacks;
    }
  };

  onFontFace = (setName: string, familyName: string, properties: CSSStyle) => {
    this.currentFontFaces[familyName] = properties;
  };

  onKeyframe = (setName: string, animationName: string, properties: CSSStyle) => {
    this.currentKeyframes[animationName] = properties;
  };

  onMediaQuery = (setName: string, mediaQuery: string, properties: CSSStyle) => {
    if (!this.currentMediaQueries[mediaQuery]) {
      this.currentMediaQueries[mediaQuery] = {};
    }

    const currentSet = this.currentMediaQueries[mediaQuery][setName];

    /* istanbul ignore next Hard to test. Only exists because of Flow */
    if (typeof currentSet === 'object' && !Array.isArray(currentSet)) {
      this.currentMediaQueries[mediaQuery][setName] = {
        ...currentSet,
        ...properties,
      };
    } else {
      this.currentMediaQueries[mediaQuery][setName] = properties;
    }
  };
}
