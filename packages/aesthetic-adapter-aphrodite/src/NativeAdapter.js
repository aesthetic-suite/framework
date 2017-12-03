/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet, css } from 'aphrodite';

import type { TransformedDeclarations } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(aphrodite: Object, options?: Object = {}) {
    super(options);

    this.aphrodite = aphrodite || StyleSheet;
  }

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    if (__DEV__) {
      if (this.native) {
        throw new Error('Aphrodite does not support React Native.');
      }
    }

    const styleSheet = this.aphrodite.create(declarations);
    const output = {};

    Object.keys(styleSheet).forEach((selector: string) => {
      output[selector] = css(styleSheet[selector]);
    });

    return output;
  }
}
