/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import { fontFace, keyframes } from 'typestyle';
import TypeStyleAdapter from './NativeAdapter';

import type {
  FontFace,
  Keyframe,
  StyleDeclaration,
  Statement,
  StyleSheet,
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

  convert(statement: Statement): Statement {
    return this.syntax.convert(statement);
  }

  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    return super.transform(styleName, this.convert(statement));
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

    // Supports
    // https://github.com/typestyle/typestyle/blob/ef832aa4b7a4eb95aa5260d83d8e11bb57bbc6c5/src/tests/supports.ts#L9
    if (this.syntax.supports[selector]) {
      injectSupports(nested, this.syntax.supports[selector]);
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
