/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet, css } from 'aphrodite';
import Adapter from '../../Adapter';

import type { StyleDeclarationMap, ClassNameMap } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const styleSheet = this.aphrodite.create(declarations);
    const classNames = {};

    Object.keys(styleSheet).forEach((setName: string) => {
      classNames[setName] = css(styleSheet[setName]);
    });

    return classNames;
  }
}
