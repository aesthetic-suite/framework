/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import injectAtRules from 'aesthetic/lib/helpers/injectAtRules';
import injectRuleByLookup from 'aesthetic/lib/helpers/injectRuleByLookup';
import { StyleSheet, css } from 'aphrodite';

import type { StyleDeclarationMap, ClassNameMap } from 'aesthetic';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
  }

  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = super.convertProperties(setName, properties);

    // Font faces
    if ('fontFamily' in nextProperties) {
      injectRuleByLookup(nextProperties, 'fontFamily', this.fontFaces);
    }

    // Animation keyframes
    if ('animationName' in nextProperties) {
      injectRuleByLookup(nextProperties, 'animationName', this.keyframes);
    }

    // Media queries
    if (this.mediaQueries[setName]) {
      injectAtRules(nextProperties, '@media', this.mediaQueries[setName]);
    }

    return nextProperties;
  }

  transformStyles(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const styleSheet = this.aphrodite.create(declarations);
    const classNames = {};

    Object.keys(styleSheet).forEach((setName: string) => {
      classNames[setName] = css(styleSheet[setName]);
    });

    return classNames;
  }
}
