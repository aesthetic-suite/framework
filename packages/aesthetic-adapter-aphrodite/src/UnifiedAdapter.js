/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import AphroditeAdapter from './NativeAdapter';

import type { Style, StyleDeclaration, StyleSheet } from '../../types';

export default class UnifiedAphroditeAdapter extends AphroditeAdapter {
  syntax: UnifiedSyntax;

  constructor(extensions?: Object[] = [], options?: Object = {}) {
    super(extensions, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('property', this.handleProperty)
      .on('@charset', this.syntax.createUnsupportedHandler('@charset'))
      .on('@fallbacks', this.syntax.createUnsupportedHandler('@fallbacks'))
      .on('@global', this.handleGlobal)
      .on('@import', this.syntax.createUnsupportedHandler('@import'))
      .on('@namespace', this.syntax.createUnsupportedHandler('@namespace'))
      .on('@page', this.syntax.createUnsupportedHandler('@page'))
      .on('@supports', this.syntax.createUnsupportedHandler('@supports'))
      .on('@viewport', this.syntax.createUnsupportedHandler('@viewport'))
      .off('@font-face')
      .off('@keyframes');
  }

  create(styleSheet: StyleSheet): StyleSheet {
    return super.create(this.syntax.convert(styleSheet));
  }

  handleGlobal(styleSheet: StyleSheet, declaration: StyleDeclaration, selector: string) {
    styleSheet.globals = {
      ...(typeof styleSheet.globals === 'object' ? styleSheet.globals : {}),
      [`*${selector}`]: declaration,
    };
  }

  handleProperty = (declaration: StyleDeclaration, style: Style, property: string) => {
    let value = style;

    if (property === 'animationName') {
      value = this.syntax.injectKeyframes(style, this.syntax.keyframes);
    } else if (property === 'fontFamily') {
      value = this.syntax.injectFontFaces(style, this.syntax.fontFaces);
    }

    declaration[property] = value;
  };
}
