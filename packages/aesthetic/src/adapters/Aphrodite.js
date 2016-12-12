/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet, css } from 'aphrodite';
import Adapter from '../Adapter';

import type { ComponentDeclarations, ClassNames } from '../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object;

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
  }

  transform(styleName: string, declarations: ComponentDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      const compiler = this.aphrodite.create(declarations);
      sheet = {};

      Object.keys(compiler).forEach((setName) => {
        sheet[setName] = css(compiler[setName]);
      });

      this.sheets[styleName] = sheet;
    }

    return { ...sheet };
  }
}
