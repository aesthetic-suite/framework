/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet, css } from 'aphrodite';

import type { Statement, StyleDeclaration, StyleSheet as AestheticStyleSheet } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(aphrodite?: Object, options?: Object = {}) {
    super(options);

    this.aphrodite = aphrodite || StyleSheet;
  }

  create(statement: Statement): AestheticStyleSheet {
    return this.aphrodite.create(statement);
  }

  transform(...styles: StyleDeclaration[]): string {
    return css(...styles);
  }
}
