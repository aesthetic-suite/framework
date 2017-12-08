/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import { formatFontFace, injectMediaQueries, injectSupports, toArray } from 'aesthetic-utils';
import JSS from 'jss';
import JSSAdapter from './NativeAdapter';

import type {
  StyleBlock,
  StyleDeclaration,
  StyleDeclarations,
  TransformedDeclarations,
} from '../../types';

export default class UnifiedJSSAdapter extends JSSAdapter {
  syntax: UnifiedSyntax;

  constructor(jss: JSS, options?: Object = {}) {
    super(jss, options);

    this.syntax = new UnifiedSyntax()
      .on('declaration', this.handleDeclaration);
  }

  convert(declarations: StyleDeclarations): StyleDeclarations {
    const adaptedDeclarations = this.syntax.convert(declarations);
    const { fontFaces, keyframes } = this.syntax;
    const globalAtRules = {};
    const fonts = [];

    // Font faces
    // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#font-face
    Object.keys(fontFaces).forEach((fontFamily) => {
      fonts.push(...fontFaces[fontFamily].map(font => formatFontFace(font)));
    });

    if (fonts.length > 0) {
      globalAtRules['@font-face'] = fonts;
    }

    // Animation keyframes
    // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#keyframes-animation
    Object.keys(keyframes).forEach((animationName) => {
      globalAtRules[`@keyframes ${animationName}`] = keyframes[animationName];
    });

    return {
      ...globalAtRules,
      ...adaptedDeclarations,
    };
  }

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    return super.transform(styleName, this.convert(declarations));
  }

  handleDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Prepend pseudos with an ampersand
    // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
    Object.keys(properties).forEach((propName: string) => {
      if (propName.charAt(0) === ':') {
        properties[`&${propName}`] = properties[propName];

        delete properties[propName];
      }
    });

    // Media queries
    // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#media-queries
    // https://github.com/cssinjs/jss-nested#use-at-rules-inside-of-regular-rules
    if (this.syntax.mediaQueries[selector]) {
      injectMediaQueries(properties, this.syntax.mediaQueries[selector]);
    }

    // Fallbacks
    // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks
    if (this.syntax.fallbacks[selector]) {
      const fallbacks: StyleBlock[] = [];

      Object.keys(this.syntax.fallbacks[selector]).forEach((propName) => {
        toArray(this.syntax.fallbacks[selector][propName]).forEach((propValue) => {
          fallbacks.push({ [propName]: propValue });
        });
      });

      properties.fallbacks = fallbacks;
    }

    // Supports
    // https://github.com/cssinjs/jss-nested#use-at-rules-inside-of-regular-rules
    if (this.syntax.supports[selector]) {
      injectSupports(properties, this.syntax.supports[selector]);
    }
  };
}
