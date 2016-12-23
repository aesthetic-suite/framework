/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet, css } from 'aphrodite';

import type { StyleDeclarations, ClassNames, CSSStyleValue } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};
  multipleStyleDeclarations: boolean = false;

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
  }

  convertPropertyValue(name: string, value: CSSStyleValue): CSSStyleValue {
    switch (name) {
      case 'fontFamily':
        return String(value).split(',').map((familyName: string) => {
          familyName = familyName.trim();

          return this.fontFaces[familyName] || familyName;
        });

      case 'animationName':
        return String(value).split(',').map((animName: string) => {
          animName = animName.trim();

          return this.keyframes[animName] || animName;
        });

      default:
        return value;
    }
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    const styleSheet = this.aphrodite.create(declarations);
    const classNames = {};

    Object.keys(styleSheet).forEach((setName: string) => {
      classNames[setName] = css(styleSheet[setName]);
    });

    return classNames;
  }
}
