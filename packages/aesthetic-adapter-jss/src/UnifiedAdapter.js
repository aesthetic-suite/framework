/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import formatFontFace from 'aesthetic/lib/helpers/formatFontFace';
import JSS from 'jss';
import JSSAdapter from './NativeAdapter';

import type {
  Style,
  StyleBlock,
  StyleDeclaration,
  StyleSheet,
} from '../../types';

export default class UnifiedJSSAdapter extends JSSAdapter {
  syntax: UnifiedSyntax;

  constructor(jss?: JSS, options?: Object = {}) {
    super(jss, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('property', this.handleProperty)
      .on('selector', this.handleSelector)
      .on('@fallbacks', this.handleFallbacks)
      .on('@font-face', this.handleFontFace)
      .on('@global', this.handleGlobal)
      .on('@page', this.syntax.createUnsupportedHandler('@page'));
  }

  create(styleSheet: StyleSheet, styleName: string): StyleSheet {
    return super.create(this.syntax.convert(styleSheet), styleName);
  }

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks
  handleFallbacks(declaration: StyleDeclaration, style: Style[], property: string) {
    const fallbacks = style.map(fallback => ({ [property]: fallback }));

    if (Array.isArray(declaration.fallbacks)) {
      declaration.fallbacks.push(...fallbacks);
    } else {
      declaration.fallbacks = fallbacks;
    }
  }

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#font-face
  handleFontFace(styleSheet: StyleSheet, style: StyleBlock[], fontFamily: string) {
    const fontFaces = style.map(face => formatFontFace(face));

    if (typeof styleSheet['@font-face'] === 'undefined') {
      styleSheet['@font-face'] = fontFaces;
    } else {
      // $FlowIgnore
      styleSheet['@font-face'].push(...fontFaces);
    }
  }

  // https://github.com/cssinjs/jss-global
  handleGlobal(styleSheet: StyleSheet, declaration: StyleDeclaration, selector: string) {
    if (typeof styleSheet['@global'] === 'undefined') {
      styleSheet['@global'] = { [selector]: declaration };
    } else {
      styleSheet['@global'][selector] = declaration;
    }
  }

  // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
  handleProperty(declaration: StyleDeclaration, style: Style, property: string) {
    declaration[property] = style;
  }

  // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
  handleSelector(declaration: StyleDeclaration, style: Style, selector: string) {
    declaration[`&${selector}`] = style;
  }
}
