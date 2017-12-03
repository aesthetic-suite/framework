/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import { injectAtRules, injectRuleByLookup } from 'aesthetic-utils';
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

  transform(styleName: string, declarations: StyleDeclarations): TransformedDeclarations {
    return super.transform(styleName, this.convert(declarations));
  }

  onDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Font faces
    // if ('fontFamily' in properties) {
    //   injectFonts(properties, this.syntax.fontFaces, true);
    // }

    // Animation keyframes
    if ('animationName' in properties) {
      injectRuleByLookup(properties, 'animationName', this.syntax.keyframes);
    }

    // Media queries
    if (this.syntax.mediaQueries[selector]) {
      injectAtRules(properties, '@media', this.syntax.mediaQueries[selector]);
    }
  };
}
