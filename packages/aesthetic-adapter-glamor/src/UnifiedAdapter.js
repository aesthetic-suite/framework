/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import { formatFontFace, injectAtRules, injectFallbacks } from 'aesthetic-utils';
import { css } from 'glamor';
import GlamorAdapter from './NativeAdapter';

import type {
  FontFace,
  Keyframe,
  StyleDeclaration,
  StyleDeclarations,
  TransformedDeclarations,
} from '../../types';

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

  convert(declarations: StyleDeclarations): StyleDeclarations {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarations): TransformedDeclarations {
    return super.transform(styleName, this.convert(declarations));
  }

  onDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Animation keyframes
    if ('animationName' in properties) {
      properties.animationName = this.syntax.keyframeNames[String(properties.animationName)];
    }

    // Media queries
    if (this.syntax.mediaQueries[selector]) {
      injectAtRules(properties, '@media', this.syntax.mediaQueries[selector]);
    }

    // Fallbacks
    if (this.syntax.fallbacks[selector]) {
      injectFallbacks(properties, this.syntax.fallbacks[selector]);
    }
  };

  onFontFace = (selector: string, familyName: string, fontFaces: FontFace[]) => {
    this.syntax.fontFaceNames[familyName] = fontFaces.map(face => (
      css.fontFace(formatFontFace(face, true))
    ));
  };

  onKeyframe = (selector: string, animationName: string, keyframe: Keyframe) => {
    this.syntax.keyframeNames[animationName] = css.keyframes(animationName, keyframe);
  };
}
