/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';
import deepMerge from 'lodash.merge';

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
  jss: JSS;
  options: StyleSheetOptions;

  constructor(jss: JSS, options: StyleSheetOptions = {}) {
    super();

    this.jss = jss || create();
    this.options = options;
  }

  convert(styleName: string, declarations: StyleDeclarations): StyleDeclarations {
    const adaptedDeclarations = super.convert(styleName, declarations);

    return {
      ...this.formatAtRules('@font-face', this.currentFontFaces),
      ...this.formatAtRules('@keyframes', this.currentKeyframes),
      ...adaptedDeclarations,
      ...this.formatMediaQueries(),
    };
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
      nextProperties.fallbacks = this.formatFallbacks(this.fallbacks[setName]);
    }

    return nextProperties;
  }

  formatFallbacks(fallbacks: CSSStyle): CSSStyle[] {
    const properties = [];

    Object.keys(fallbacks).forEach((propName: string) => {
      const fallback = fallbacks[propName];

      if (Array.isArray(fallback)) {
        fallback.forEach(propValue => properties.push({ [propName]: propValue }));
      } else {
        properties.push({ [propName]: fallback });
      }
    });

    return properties;
  }

  formatMediaQueries() {
    const mediaQueries = {};

    Object.keys(this.mediaQueries).forEach((setName: string) => {
      Object.keys(this.mediaQueries[setName]).forEach((query: string) => {
        deepMerge(mediaQueries, {
          [`@media ${query}`]: {
            [setName]: this.mediaQueries[setName][query],
          },
        });
      });
    });

    return mediaQueries;
  }

  onConvertStart() {
    this.currentFontFaces = {};
    this.currentKeyframes = {};
  }

  onExtractedFontFace(setName: string, familyName: string, properties: CSSStyle) {
    this.currentFontFaces[familyName] = properties;
  }

  onExtractedKeyframes(setName: string, animationName: string, properties: CSSStyle) {
    this.currentKeyframes[animationName] = properties;
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
