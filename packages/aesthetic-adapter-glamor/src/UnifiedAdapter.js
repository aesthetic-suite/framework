/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import {
  formatFontFace,
  injectFallbacks,
  injectKeyframes,
  injectMediaQueries,
  injectSupports,
} from 'aesthetic-utils';
import { css } from 'glamor';
import GlamorAdapter from './NativeAdapter';

import type {
  FontFace,
  Keyframe,
  StyleDeclaration,
  Statement,
  StyleSheet,
} from '../../types';

export default class UnifiedGlamorAdapter extends GlamorAdapter {
  syntax: UnifiedSyntax;

  constructor(options?: Object = {}) {
    super(options);

    this.syntax = new UnifiedSyntax()
      .on('declaration', this.handleDeclaration)
      .on('fontFace', this.handleFontFace)
      .on('keyframe', this.handleKeyframe);
  }

  convert(statement: Statement): Statement {
    return this.syntax.convert(statement);
  }

  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    return super.transform(styleName, this.convert(statement));
  }

  handleDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Font faces
    // https://github.com/threepointone/glamor/blob/master/docs/api.md#cssfontfacefont
    // Use the `fontFamily` property as-is.

    // Animation keyframes
    // https://github.com/threepointone/glamor/blob/master/docs/api.md#csskeyframestimeline
    if ('animationName' in properties) {
      injectKeyframes(properties, this.syntax.keyframesCache, {
        join: true,
      });
    }

    // Media queries
    // https://github.com/threepointone/glamor/blob/master/docs/selectors.md
    if (this.syntax.mediaQueries[selector]) {
      injectMediaQueries(properties, this.syntax.mediaQueries[selector]);
    }

    // Fallbacks
    // https://github.com/threepointone/glamor/blob/master/docs/api.md#cssrules
    if (this.syntax.fallbacks[selector]) {
      injectFallbacks(properties, this.syntax.fallbacks[selector]);
    }

    // Supports
    // https://github.com/threepointone/glamor/blob/master/docs/selectors.md
    if (this.syntax.supports[selector]) {
      injectSupports(properties, this.syntax.supports[selector]);
    }
  };

  handleFontFace = (selector: string, familyName: string, fontFaces: FontFace[]) => {
    this.syntax.fontFacesCache[familyName] = fontFaces.map(face => (
      css.fontFace(formatFontFace(face))
    ));
  };

  handleKeyframe = (selector: string, animationName: string, keyframe: Keyframe) => {
    this.syntax.keyframesCache[animationName] = css.keyframes(animationName, keyframe);
  };
}
