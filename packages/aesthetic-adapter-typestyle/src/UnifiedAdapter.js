/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import formatFontFace from 'aesthetic/lib/helpers/formatFontFace';
import { TypeStyle } from 'typestyle';
import TypeStyleAdapter from './NativeAdapter';

import type { Style, StyleBlock, StyleDeclaration, StyleSheet } from '../../types';

export default class UnifiedTypeStyleAdapter extends TypeStyleAdapter {
  syntax: UnifiedSyntax;

  constructor(typeStyle?: TypeStyle, options?: Object = {}) {
    super(typeStyle, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('property', this.handleProperty)
      .on('selector', this.handleSelector)
      .on('@charset', this.syntax.createUnsupportedHandler('@charset'))
      .on('@fallbacks', this.handleFallbacks)
      .on('@font-face', this.handleFontFace)
      .on('@global', this.handleGlobal)
      .on('@import', this.syntax.createUnsupportedHandler('@import'))
      .on('@keyframes', this.handleKeyframe)
      .on('@media', this.handleMedia)
      .on('@namespace', this.syntax.createUnsupportedHandler('@namespace'))
      .on('@page', this.syntax.createUnsupportedHandler('@page'))
      .on('@supports', this.handleSupports)
      .on('@viewport', this.syntax.createUnsupportedHandler('@viewport'));
  }

  create(styleSheet: StyleSheet): StyleSheet {
    return super.create(this.syntax.convert(styleSheet));
  }

  handleFallbacks(declaration: StyleDeclaration, style: Style[], property: string) {
    declaration[property] = [...style, declaration[property]].filter(Boolean);
  }

  handleFontFace = (styleSheet: StyleSheet, style: StyleBlock[], fontFamily: string) => {
    style.map(face => this.typeStyle.fontFace(formatFontFace(face)));
  };

  handleGlobal = (styleSheet: StyleSheet, declaration: StyleDeclaration, selector: string) => {
    this.typeStyle.cssRule(selector, declaration);
  };

  handleKeyframe = (styleSheet: StyleSheet, style: StyleBlock, animationName: string) => {
    this.syntax.keyframesCache[animationName] = this.typeStyle.keyframes(style);
  };

  handleMedia = (declaration: StyleDeclaration, style: StyleBlock, condition: string) => {
    this.injectNested(declaration, {
      [`@media ${condition}`]: style,
    });
  };

  handleProperty = (declaration: StyleDeclaration, style: Style, property: string) => {
    if (property === 'animationName') {
      declaration[property] = this.syntax.injectKeyframes(style, this.syntax.keyframesCache);
    } else {
      declaration[property] = style;
    }
  };

  handleSelector = (declaration: StyleDeclaration, style: Style, selector: string) => {
    this.injectNested(declaration, {
      [`&${selector}`]: style,
    });
  };

  handleSupports = (declaration: StyleDeclaration, style: StyleBlock, condition: string) => {
    this.injectNested(declaration, {
      [`@supports ${condition}`]: style,
    });
  };

  injectNested(declaration: StyleDeclaration, style: StyleBlock) {
    if (typeof declaration.$nest === 'undefined') {
      declaration.$nest = {};
    }

    declaration.$nest = this.merge(declaration.$nest, style);
  }
}
