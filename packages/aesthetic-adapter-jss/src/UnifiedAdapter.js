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
  Fallbacks,
  MediaQuery,
  Style,
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
      .on('property', this.handleProperty)
      .on('@fallbacks', this.handleFallbacks)
      .on('@font-face', this.handleFontFace)
      .on('@keyframes', this.handleKeyframes)
      .on('@media', this.handleMedia)
      .on('@supports', this.handleSupports);
  }

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    return super.transform(styleName, this.syntax.convert(declarations));
  }

  // Fallbacks
  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks
  handleFallbacks = (
    statement: StyleDeclarations,
    declaration: StyleDeclaration,
    fallbacks: Fallbacks,
  ) => {
    declaration.fallbacks = [];

    Object.keys(fallbacks).forEach((property) => {
      toArray(fallbacks[property]).forEach((fallback) => {
        declaration.fallbacks.push({
          [property]: fallback,
        });
      });
    });
  };

  // Font faces
  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#font-face
  handleFontFace = (
    statement: StyleDeclarations,
    fontFaces: FontFace[],
    fontFamily: string,
  ) => {
    statement['@font-face'] = fontFaces.map(font => formatFontFace(font));
  };

  // Animation keyframes
  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#keyframes-animation
  handleKeyframes = (
    statement: StyleDeclarations,
    keyframes: Keyframe,
    animationName: string,
  ) => {
    statement[`@keyframes ${animationName}`] = keyframes;
  };

  // Media queries
  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#media-queries
  // https://github.com/cssinjs/jss-nested#use-at-rules-inside-of-regular-rules
  handleMedia = (
    statement: StyleDeclarations,
    declaration: StyleDeclaration,
    style: MediaQuery,
    condition: string,
  ) => {
    declaration[`@media ${condition}`] = style;
  };

  // Prepend pseudos with an ampersand
  // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
  handleProperty = (
    statement: StyleDeclarations,
    declaration: StyleDeclaration,
    style: Style,
    property: string,
  ) => {
    console.log(property, style);
    if (property.charAt(0) === ':') {
      declaration[`&${property}`] = style;
    } else {
      declaration[property] = style;
    }
  };

  // Supports
  // https://github.com/cssinjs/jss-nested#use-at-rules-inside-of-regular-rules
  handleSupports = (
    statement: StyleDeclarations,
    declaration: StyleDeclaration,
    style: Support,
    condition: string,
  ) => {
    declaration[`@supports ${condition}`] = style;
  };
}
