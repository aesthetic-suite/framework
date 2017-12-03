/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import { injectFontFaces, injectKeyframes, injectMediaQueries } from 'aesthetic-utils';
import AphroditeAdapter from './NativeAdapter';

import type { StyleDeclaration, StyleDeclarations, TransformedDeclarations } from '../../types';

export default class UnifiedAphroditeAdapter extends AphroditeAdapter {
  syntax: UnifiedSyntax;

  constructor(aphrodite: Object, options?: Object = {}) {
    super(aphrodite, options);

    this.syntax = new UnifiedSyntax();
    this.syntax.on('declaration', this.onDeclaration);
  }

  convert(declarations: StyleDeclarations): StyleDeclarations {
    return this.syntax.convert(declarations);
  }

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    return super.transform(styleName, this.convert(declarations));
  }

  onDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Font faces
    if ('fontFamily' in properties) {
      injectFontFaces(properties, this.syntax.fontFaces);
    }

    // Animation keyframes
    if ('animationName' in properties) {
      injectKeyframes(properties, this.syntax.keyframes);
    }

    // Media queries
    if (this.syntax.mediaQueries[selector]) {
      injectMediaQueries(properties, this.syntax.mediaQueries[selector]);
    }
  };
}
