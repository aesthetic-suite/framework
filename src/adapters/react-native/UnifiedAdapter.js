/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from '../../UnifiedSyntax';
import ReactNativeAdapter from './NativeAdapter';

import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class UnifiedReactNativeAdapter extends ReactNativeAdapter {
  syntax: UnifiedSyntax;

  constructor() {
    super();

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('fontFace', this.onFontFace)
      .on('keyframe', this.onKeyframe)
      .on('mediaQuery', this.onMediaQuery);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    return super.transform(styleName, this.convert(declarations));
  }

  onFontFace = () => {
    throw new SyntaxError(
      'React Native does not support font faces. ' +
      'Please use the IOS/Android built-in font manager.',
    );
  };

  onKeyframe = () => {
    throw new SyntaxError(
      'React Native does not support animation keyframes. ' +
      'Please use the provided `Animated` library.',
    );
  };

  onMediaQuery = () => {
    throw new SyntaxError(
      'React Native does not support media queries. ' +
      'Please use a third-party library for this functionality.',
    );
  };
}
