/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet, css } from 'aphrodite';
import Adapter from '../Adapter';

import type { SheetDeclaration } from 'aphrodite';
import type { ComponentDeclarations, ClassNames } from '../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object;
  sheets: { [key: string]: SheetDeclaration };

  constructor(aphrodite: Object) {
    super();

    this.aphrodite = aphrodite || StyleSheet;
    this.sheets = {};
  }

  transform(styleName: string, declarations: ComponentDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    // Create and cache a new stylesheet
    if (!sheet) {
      this.sheets[styleName] = sheet = this.aphrodite.create(declarations);
    }

    // Convert to class names
    const classNames = {};

    Object.keys(sheet).forEach((setName) => {
      classNames[setName] = css(sheet[setName]);
    });

    return classNames;
  }
}
