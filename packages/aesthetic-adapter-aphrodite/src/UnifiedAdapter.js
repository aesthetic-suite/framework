/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import { injectFontFaces, injectKeyframes, injectMediaQueries } from 'aesthetic-utils';
import AphroditeAdapter from './NativeAdapter';

import type { StyleDeclaration, Statement, StyleSheet } from '../../types';

export default class UnifiedAphroditeAdapter extends AphroditeAdapter {
  syntax: UnifiedSyntax;

  constructor(aphrodite: Object, options?: Object = {}) {
    super(aphrodite, options);

    this.syntax = new UnifiedSyntax()
      .on('declaration', this.handleDeclaration);
  }

  convert(statement: Statement): Statement {
    return this.syntax.convert(statement);
  }

  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    return super.transform(styleName, this.convert(statement));
  }

  handleDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Font faces
    // https://github.com/Khan/aphrodite#font-faces
    if ('fontFamily' in properties) {
      injectFontFaces(properties, this.syntax.fontFaces, {
        format: true,
      });
    }

    // Animation keyframes
    // https://github.com/Khan/aphrodite#animations
    if ('animationName' in properties) {
      injectKeyframes(properties, this.syntax.keyframes);
    }

    // Media queries
    // https://github.com/Khan/aphrodite#api
    if (this.syntax.mediaQueries[selector]) {
      injectMediaQueries(properties, this.syntax.mediaQueries[selector]);
    }

    // Fallbacks
    // Aphrodite does not support fallbacks.

    // Supports
    // Aphrodite does not support @supports.
  };
}
