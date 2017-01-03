/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import injectAtRules from 'aesthetic/lib/helpers/injectAtRules';
import toArray from 'aesthetic/lib/helpers/toArray';
import JSS, { create } from 'jss';

import type { StyleDeclarations, ClassNames, CSSStyle, AtRules } from '../../types';

type StyleSheetOptions = {
  element?: Object,
  index?: number,
  media?: string,
  meta?: string,
  named?: boolean,
  virtual?: boolean,
};

export default class JSSAdapter extends Adapter {
  currentFontFaces: AtRules = {};
  currentKeyframes: AtRules = {};
  currentMediaQueries: AtRules = {};
  jss: JSS;
  options: StyleSheetOptions;

  constructor(jss: JSS, options: StyleSheetOptions = {}) {
    super();

    this.jss = jss || create();
    this.options = options;
  }

  convert(styleName: string, declarations: StyleDeclarations): StyleDeclarations {
    const adaptedDeclarations = super.convert(styleName, declarations);

    injectAtRules(adaptedDeclarations, '@font-face', this.currentFontFaces);
    injectAtRules(adaptedDeclarations, '@keyframes', this.currentKeyframes);
    injectAtRules(adaptedDeclarations, '@media', this.currentMediaQueries);

    return adaptedDeclarations;
  }

  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = super.convertProperties(setName, properties);

    // Prepend pseudos with an ampersand
    Object.keys(nextProperties).forEach((propName: string) => {
      if (propName.charAt(0) === ':') {
        nextProperties[`&${propName}`] = nextProperties[propName];

        delete nextProperties[propName];
      }
    });

    // Fallbacks
    if (this.fallbacks[setName]) {
      nextProperties.fallbacks = Object.keys(this.fallbacks[setName])
        .reduce((list: CSSStyle[], propName: string) => (
          [
            ...list,
            ...toArray(this.fallbacks[setName][propName]).map((propValue: string) => ({
              [propName]: propValue,
            })),
          ]
        ), []);
    }

    return nextProperties;
  }

  onConvertStart() {
    this.currentFontFaces = {};
    this.currentKeyframes = {};
    this.currentMediaQueries = {};
  }

  onExtractedFontFace(setName: string, familyName: string, properties: CSSStyle) {
    this.currentFontFaces[familyName] = properties;
  }

  onExtractedKeyframe(setName: string, animationName: string, properties: CSSStyle) {
    this.currentKeyframes[animationName] = properties;
  }

  onExtractedMediaQuery(setName: string, mediaQuery: string, properties: CSSStyle) {
    if (!this.currentMediaQueries[mediaQuery]) {
      this.currentMediaQueries[mediaQuery] = {};
    }

    const currentSet = this.currentMediaQueries[mediaQuery][setName];

    if (typeof currentSet === 'object' && !Array.isArray(currentSet)) {
      this.currentMediaQueries[mediaQuery][setName] = {
        ...currentSet,
        ...properties,
      };
    } else {
      this.currentMediaQueries[mediaQuery][setName] = properties;
    }
  }

  transformStyles(styleName: string, declarations: StyleDeclarations): ClassNames {
    const styleSheet = this.jss.createStyleSheet(declarations, {
      named: true,
      meta: styleName,
      ...this.options,
    }).attach();

    return { ...styleSheet.classes };
  }
}
