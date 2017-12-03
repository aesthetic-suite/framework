/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import { injectAtRules, injectFallbacks, injectMediaQueries } from 'aesthetic-utils';
import FelaAdapter from './NativeAdapter';

import type { Renderer } from 'fela'; // eslint-disable-line
import type {
  FontFace,
  Keyframe,
  StyleDeclaration,
  StyleDeclarations,
  TransformedDeclarations,
} from '../../types';

export default class UnifiedFelaAdapter extends FelaAdapter {
  syntax: UnifiedSyntax;

  constructor(fela: Renderer, options?: Object = {}) {
    super(fela, options);

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
    // Font faces
    if ('fontFamily' in properties) {
      injectRuleByLookup(properties, 'fontFamily', this.syntax.fontFacesCache, true);
    }

    // Animation keyframes
    if ('animationName' in properties) {
      injectRuleByLookup(properties, 'animationName', this.syntax.keyframesCache, true);
    }

    // Media queries
    if (this.syntax.mediaQueries[selector]) {
      injectMediaQueries(properties, this.syntax.mediaQueries[selector]);
    }

    // Fallbacks
    if (this.syntax.fallbacks[selector]) {
      injectFallbacks(properties, this.syntax.fallbacks[selector]);
    }
  };

  onFontFace = (selector: string, familyName: string, fontFaces: FontFace[]) => {
    this.syntax.fontFacesCache[familyName] = fontFaces.map((face) => {
      const { src, ...props } = face;

      return this.fela.renderFont(familyName, src, props);
    });
  }

  onKeyframe = (selector: string, animationName: string, keyframe: Keyframe) => {
    this.syntax.keyframesCache[animationName] = this.fela.renderKeyframe(() => keyframe);
  };
}
