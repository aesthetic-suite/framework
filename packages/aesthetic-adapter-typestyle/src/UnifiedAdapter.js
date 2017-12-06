/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import {
  formatFontFace,
  injectFallbacks,
  injectKeyframes,
  injectMediaQueries,
} from 'aesthetic-utils';
import { fontFace, keyframes } from 'typestyle';
import TypeStyleAdapter from './NativeAdapter';

import type {
  FontFace,
  Keyframe,
  StyleDeclaration,
  StyleDeclarations,
  TransformedDeclarations,
} from '../../types';

export default class UnifiedTypeStyleAdapter extends TypeStyleAdapter {
  syntax: UnifiedSyntax;

  constructor(options?: Object = {}) {
    super(options);

    this.syntax = new UnifiedSyntax()
      .on('declaration', this.handleDeclaration)
      .on('fontFace', this.handleFontFace)
      .on('keyframe', this.handleKeyframe);
  }

  convert(declarations: StyleDeclarations): StyleDeclarations {
    return this.syntax.convert(declarations);
  }

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    return super.transform(styleName, this.convert(declarations));
  }

  handleDeclaration = (selector: string, properties: StyleDeclaration) => {
    const nested = {};

    // Move pseudos to a $nest property
    // https://typestyle.github.io/#/core/concept-interpolation
    Object.keys(properties).forEach((propName: string) => {
      if (propName.charAt(0) === ':') {
        nested[`&${propName}`] = properties[propName];

        delete properties[propName];
      }
    });

    // Font faces
    // https://typestyle.github.io/#/raw/-fontface-
    // Use the `fontFamily` property as-is.

    // Animation keyframes
    // https://typestyle.github.io/#/core/concept-keyframes
    if ('animationName' in properties) {
      injectKeyframes(properties, this.syntax.keyframesCache, {
        join: true,
      });
    }

    // Media queries
    // https://typestyle.github.io/#/core/concept-media-queries
    // https://github.com/typestyle/typestyle/blob/master/src/internal/utilities.ts#L78
    if (this.syntax.mediaQueries[selector]) {
      injectMediaQueries(nested, this.syntax.mediaQueries[selector]);
    }

    // Fallbacks
    // https://typestyle.github.io/#/core/concept-fallbacks
    if (this.syntax.fallbacks[selector]) {
      injectFallbacks(properties, this.syntax.fallbacks[selector]);
    }

    if (Object.keys(nested).length > 0) {
      properties.$nest = nested;
    }
  };

  handleFontFace = (selector: string, familyName: string, fontFaces: FontFace[]) => {
    fontFaces.map(face => fontFace(formatFontFace(face)));
  };

  handleKeyframe = (selector: string, animationName: string, keyframe: Keyframe) => {
    this.syntax.keyframesCache[animationName] = keyframes(keyframe);
  };
}
