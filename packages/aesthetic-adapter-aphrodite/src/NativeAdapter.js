/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet, css } from 'aphrodite';

import type { Statement, StyleSheet as AestheticStyleSheet } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(aphrodite?: Object, options?: Object = {}) {
    super(options);

    this.aphrodite = aphrodite || StyleSheet;
  }

  transform(styleName: string, statement: Statement): AestheticStyleSheet {
    const styleSheet = this.aphrodite.create(statement);
    const output = {};

    Object.keys(styleSheet).forEach((selector) => {
      output[selector] = css(styleSheet[selector]);
    });

    return output;
  }
}
