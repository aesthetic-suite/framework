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
    if (process.env.NODE_ENV === 'development') {
      if (this.native) {
        throw new Error('Aphrodite does not support React Native.');
      }
    }

    const styleSheet = this.aphrodite.create(declarations);
    const output = {};

    Object.keys(styleSheet).forEach((setName: string) => {
      output[setName] = css(styleSheet[setName]);
    });

    return output;
  }
}
