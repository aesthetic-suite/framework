/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from '../../UnifiedSyntax';
import injectAtRules from '../../utils/injectAtRules';
import injectRuleByLookup from '../../utils/injectRuleByLookup';
import AphroditeAdapter from './NativeAdapter';

import type { StyleDeclarationMap, TransformedStylesMap, CSSStyle } from '../../types';

export default class UnifiedAphroditeAdapter extends AphroditeAdapter {
  syntax: UnifiedSyntax;

  constructor(aphrodite: Object, options: Object = {}) {
    super(aphrodite, options);

    this.syntax = new UnifiedSyntax();
    this.syntax.on('declaration', this.onDeclaration);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    return super.transform(styleName, this.convert(declarations));
  }

  onDeclaration = (setName: string, properties: CSSStyle) => {
    // Font faces
    if ('fontFamily' in properties) {
      injectRuleByLookup(properties, 'fontFamily', this.syntax.fontFaces);
    }

    // Animation keyframes
    if ('animationName' in properties) {
      injectRuleByLookup(properties, 'animationName', this.syntax.keyframes);
    }

    // Media queries
    if (this.syntax.mediaQueries[setName]) {
      injectAtRules(properties, '@media', this.syntax.mediaQueries[setName]);
    }
  };
}
