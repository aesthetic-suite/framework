/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import { injectAtRules, injectFallbacks } from 'aesthetic-utils';
import { css } from 'glamor';
import GlamorAdapter from './NativeAdapter';

import type { StyleDeclarationMap, TransformedStylesMap, CSSStyle } from '../../types';

export default class UnifiedGlamorAdapter extends GlamorAdapter {
  syntax: UnifiedSyntax;

  constructor(options?: Object = {}) {
    super(options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('declaration', this.onDeclaration)
      .on('fontFace', this.onFontFace)
      .on('keyframe', this.onKeyframe);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    return super.transform(styleName, this.convert(declarations));
  }

  onDeclaration = (setName: string, properties: CSSStyle) => {
    // Animation keyframes
    if ('animationName' in properties) {
      properties.animationName = this.syntax.keyframeNames[String(properties.animationName)];
    }

    // Media queries
    if (this.syntax.mediaQueries[setName]) {
      injectAtRules(properties, '@media', this.syntax.mediaQueries[setName]);
    }

    // Fallbacks
    if (this.syntax.fallbacks[setName]) {
      injectFallbacks(properties, this.syntax.fallbacks[setName]);
    }
  };

  onFontFace = (setName: string, familyName: string, properties: CSSStyle) => {
    this.syntax.fontFaceNames[familyName] = css.fontFace(properties);
  };

  onKeyframe = (setName: string, animationName: string, properties: CSSStyle) => {
    this.syntax.keyframeNames[animationName] = css.keyframes(animationName, properties);
  };
}
