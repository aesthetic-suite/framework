/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet, css } from 'aphrodite';
import deepMerge from 'lodash.merge';

import type { StyleDeclarations, ClassNames } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
  }

  lookupRule(value: string, lookup: CSSStyle): string[] {
    if (typeof value !== 'string') {
      return value;
    }

    return value.split(',').map((name: string) => {
      name = name.trim();

      return lookup[name] || name;
    });
  }

  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = super.convertProperties(setName, properties);

    // Font faces
    if ('fontFamily' in nextProperties) {
      nextProperties.fontFamily = this.lookupRule(nextProperties.fontFamily, this.fontFaces);
    }

    // Animation keyframes
    if ('animationName' in nextProperties) {
      nextProperties.animationName = this.lookupRule(nextProperties.animationName, this.keyframes);
    }

    // Media queries
    if (this.mediaQueries[setName]) {
      deepMerge(nextProperties, this.formatAtRules('@media', this.mediaQueries[setName]));
    }

    return nextProperties;
  }

  transformStyles(styleName: string, declarations: StyleDeclarations): ClassNames {
    const styleSheet = this.aphrodite.create(declarations);
    const classNames = {};

    Object.keys(styleSheet).forEach((setName: string) => {
      classNames[setName] = css(styleSheet[setName]);
    });

    return classNames;
  }
}
