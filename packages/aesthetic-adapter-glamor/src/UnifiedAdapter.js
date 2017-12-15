/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import formatFontFace from 'aesthetic/lib/helpers/formatFontFace';
import { css } from 'glamor';
import GlamorAdapter from './NativeAdapter';

import type { Statement, StyleDeclaration, StyleSheet } from '../../types';

export default class UnifiedGlamorAdapter extends GlamorAdapter {
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
      .on('@namespace', this.syntax.createUnsupportedHandler('@namespace'))
      .on('@page', this.syntax.createUnsupportedHandler('@page'))
      .on('@viewport', this.syntax.createUnsupportedHandler('@viewport'));
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    return super.transform(styleName, this.syntax.convert(statement));
  }

  // https://github.com/threepointone/glamor/blob/master/docs/api.md#cssfontfacefont
  handleFontFace = (statement: Statement, style: StyleBlock[], fontFamily: string) => {
    style.forEach((face) => {
      css.fontFace(formatFontFace(face));
    });
  };

  // https://github.com/threepointone/glamor/blob/master/docs/api.md#csskeyframestimeline
  handleKeyframe = (statement: Statement, style: StyleBlock, animationName: string) => {
    this.syntax.keyframesCache[animationName] = css.keyframes(animationName, style);
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
