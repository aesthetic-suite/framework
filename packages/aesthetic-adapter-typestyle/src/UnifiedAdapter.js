/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import TypeStyleAdapter from './NativeAdapter';

import type {
  Statement,
  Style,
  StyleBlock,
  StyleDeclaration,
  StyleSheet,
} from '../../types';

export default class UnifiedTypeStyleAdapter extends TypeStyleAdapter {
  syntax: UnifiedSyntax;

  constructor(options?: Object = {}) {
    super(options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('property', this.handleProperty)
      .on('@charset', this.syntax.createUnsupportedHandler('@charset'))
      .on('@document', this.syntax.createUnsupportedHandler('@document'))
      .on('@font-face', this.handleFontFace)
      .on('@import', this.syntax.createUnsupportedHandler('@import'))
      .on('@keyframes', this.handleKeyframe)
      .on('@media', this.handleMedia)
      .on('@namespace', this.syntax.createUnsupportedHandler('@namespace'))
      .on('@page', this.syntax.createUnsupportedHandler('@page'))
      .on('@supports', this.handleSupports)
      .on('@viewport', this.syntax.createUnsupportedHandler('@viewport'));
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    return super.transform(styleName, this.syntax.convert(statement));
  }

  handleFontFace = (statement: Statement, style: StyleBlock[], fontFamily: string) => {
    style.map(face => this.typeStyle.fontFace(face));
  };

  handleKeyframe = (statement: Statement, style: StyleBlock, animationName: string) => {
    this.syntax.keyframesCache[animationName] = this.typeStyle.keyframes(style);
  };

  handleMedia = (declaration: StyleDeclaration, style: StyleBlock, condition: string) => {
    this.injectNested(declaration, {
      [`@media ${condition}`]: style,
    });
  };

  handleProperty = (declaration: StyleDeclaration, style: Style, property: string) => {
    if (property.charAt(0) === ':') {
      this.injectNested(declaration, {
        [`&${property}`]: style,
      });

    } else if (property === 'animationName') {
      declaration[property] = this.syntax.injectKeyframes(style, this.syntax.keyframesCache);

    } else {
      declaration[property] = style;
    }
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

    Object.assign(declaration.$nest, style);
  }
}
