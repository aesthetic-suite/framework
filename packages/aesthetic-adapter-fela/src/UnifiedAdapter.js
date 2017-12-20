/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import FelaAdapter from './NativeAdapter';

import type { Renderer } from 'fela'; // eslint-disable-line
import type {
  Style,
  StyleBlock,
  StyleDeclaration,
  StyleSheet,
} from '../../types';

export default class UnifiedFelaAdapter extends FelaAdapter {
  syntax: UnifiedSyntax;

  constructor(fela?: Renderer, options?: Object = {}) {
    super(fela, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('property', this.handleProperty)
      .on('@charset', this.syntax.createUnsupportedHandler('@charset'))
      .on('@font-face', this.handleFontFace)
      .on('@import', this.syntax.createUnsupportedHandler('@import'))
      .on('@keyframes', this.handleKeyframe)
      .on('@namespace', this.syntax.createUnsupportedHandler('@namespace'))
      .on('@page', this.syntax.createUnsupportedHandler('@page'))
      .on('@viewport', this.syntax.createUnsupportedHandler('@viewport'));
  }

  create(styleSheet: StyleSheet): StyleSheet {
    return super.create(this.syntax.convert(styleSheet));
  }

  // http://fela.js.org/docs/basics/Fonts.html
  // http://fela.js.org/docs/basics/Renderer.html#renderfont
  handleFontFace = (styleSheet: StyleSheet, style: StyleBlock[], fontFamily: string) => {
    this.syntax.fontFacesCache[fontFamily] = style.map((face) => {
      const { srcPaths, local, ...props } = face;

      return this.fela.renderFont(fontFamily, srcPaths, {
        ...props,
        localAlias: local,
      });
    });
  }

  // http://fela.js.org/docs/basics/Keyframes.html
  // http://fela.js.org/docs/basics/Renderer.html#renderkeyframe
  handleKeyframe = (styleSheet: StyleSheet, style: StyleBlock, animationName: string) => {
    this.syntax.keyframesCache[animationName] = this.fela.renderKeyframe(() => style);
  };

  handleProperty = (declaration: StyleDeclaration, style: Style, property: string) => {
    if (property === 'animationName') {
      declaration[property] = this.syntax
        .injectKeyframes(style, this.syntax.keyframesCache).join(', ');

    } else {
      declaration[property] = style;
    }
  };
}
