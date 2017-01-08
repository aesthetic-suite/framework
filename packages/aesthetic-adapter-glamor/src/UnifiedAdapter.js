/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import { injectAtRules, injectFallbacks } from 'aesthetic-utils';
import { css } from 'glamor';
import GlamorAdapter from './NativeAdapter';

import type { StyleDeclarationMap, ClassNameMap, CSSStyle } from 'aesthetic';

export default class UnifiedGlamorAdapter extends GlamorAdapter {
  syntax: UnifiedSyntax;

  constructor() {
    super();

    this.syntax = new UnifiedSyntax();
    this.syntax.on('declaration', this.onDeclaration);
    this.syntax.on('fontFace', this.onFontFace);
    this.syntax.on('keyframe', this.onKeyframe);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
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
