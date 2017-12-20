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
  Statement,
  StyleSheet,
} from '../../types';

export default class UnifiedJSSAdapter extends JSSAdapter {
  syntax: UnifiedSyntax;

  constructor(jss?: JSS, options?: Object = {}) {
    super(jss, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('property', this.handleProperty)
      .on('@fallbacks', this.handleFallbacks)
      .on('@font-face', this.handleFontFace)
      .on('@page', this.syntax.createUnsupportedHandler('@page'));
  }

  create(statement: Statement): StyleSheet {
    return super.create(this.syntax.convert(statement));
  }

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks
  handleFallbacks(declaration: StyleDeclaration, style: Style[], property: string) {
    if (!Array.isArray(declaration.fallbacks)) {
      declaration.fallbacks = [];
    }

    style.forEach((fallback) => {
      declaration.fallbacks.push({
        [property]: fallback,
      });
    });
  }

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#font-face
  handleFontFace(statement: Statement, style: StyleBlock[], fontFamily: string) {
    statement['@font-face'] = style.map(face => formatFontFace(face));
  }

  // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
  handleProperty(declaration: StyleDeclaration, style: Style, property: string) {
    if (property.charAt(0) === ':') {
      declaration[`&${property}`] = style;
    } else {
      declaration[property] = style;
    }
  }
}
