/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';
import deepMerge from 'lodash.merge';

import type { StyleDeclarations, ClassNames } from '../../types';

type StyleSheetOptions = {
  element?: Object,
  index?: number,
  media?: string,
  meta?: string,
  named?: boolean,
  virtual?: boolean,
};

export default class JSSAdapter extends Adapter {
  jss: JSS;
  options: StyleSheetOptions;

  constructor(jss: JSS, options: StyleSheetOptions = {}) {
    super();

    this.jss = jss || create();
    this.options = options;
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

  formatFallbacks(fallbacks: CSSStyle): CSSStyle {
    const properties = [];

    Object.keys(fallbacks).forEach((propName: string) => {
      const fallback = fallbacks[propName];

      if (Array.isArray(fallback)) {
        fallback.forEach((propValue: string) => {
          properties.push({ [propName]: propValue });
        });
      } else {
        properties.push({ [propName]: fallback });
      }
    });

    return properties;
  }

  transformStyles(styleName: string, declarations: StyleDeclarations): ClassNames {
    const nextDeclarations = { ...declarations };
    const mediaQueries = this.mediaQueries;

    // Media queries are defined at the root for JSS
    Object.keys(mediaQueries).forEach((setName: string) => {
      Object.keys(mediaQueries[setName]).forEach((query: string) => {
        deepMerge(nextDeclarations, {
          [`@media ${query}`]: {
            [setName]: mediaQueries[setName][query],
          },
        });
      });
    });

    // Apply transformation
    const styleSheet = this.jss.createStyleSheet(nextDeclarations, {
      named: true,
      meta: styleName,
      ...this.options,
    }).attach();

    return { ...styleSheet.classes };
  }
}
