/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet, css } from 'aphrodite';
import Adapter from '../Adapter';

import type { SheetDeclaration, Extension } from 'aphrodite';
import type { StyleDeclarationMap, ClassNameMap } from '../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: StyleSheet;
  sheets: { [key: string]: SheetDeclaration };

  /**
   * {@inheritDoc}
   */
  constructor(extensions: Extension[] = []) {
    super();

    this.aphrodite = extensions.length ? StyleSheet.extend(extensions) : StyleSheet;
  }

  /**
   * {@inheritDoc}
   */
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
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
