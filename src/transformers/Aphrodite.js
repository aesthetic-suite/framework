/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet, css } from 'aphrodite';
import type { StyleDeclarationMap, ClassNameMap } from '../types';

export default class AphroditeTransformer {
  constructor(extensions = []) {
    super();

    this.aphrodite = extensions.length ? StyleSheet.extend(extensions) : StyleSheet;
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const sheet = this.aphrodite.create(declarations);
    const classNames = {};

    return classNames;
  }
}
