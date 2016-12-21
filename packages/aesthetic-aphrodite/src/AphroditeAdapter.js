/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet, css } from 'aphrodite';

import type { StyleDeclarations, ClassNames } from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object;

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      const compiledSheet = this.aphrodite.create(declarations);
      const classNames = {};

      Object.keys(compiledSheet).forEach((setName: string) => {
        classNames[setName] = css(compiledSheet[setName]);
      });

      this.sheets[styleName] = sheet = {
        sheet: compiledSheet,
        classNames,
      };
    }

    return { ...sheet.classNames };
  }
}
