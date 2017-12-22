/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type { ClassName, StyleDeclaration } from '../../types';

export default class ClassNameAdapter extends Adapter {
  unifiedSyntax: boolean = false;

  transform(...styles: StyleDeclaration[]): ClassName {
    const classNames = [];

    styles.forEach((style) => {
      if (style && typeof style === 'string') {
        classNames.push(style);
      } else if (__DEV__) {
        throw new TypeError(`${this.constructor.name} expects valid CSS class names.`);
      }
    });

    return classNames.join(' ');
  }
}
