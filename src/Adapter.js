/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { StyleDeclarationMap, ClassNameMap } from './types';

export default class Adapter {
  sheets: { [key: string]: any };

  constructor() {
    this.sheets = {};
  }

  /**
   * Transform the style objects into a mapping of CSS class names.
   *
   * @param {String} styleName
   * @param {Object} declarations
   * @returns {Object}
   */
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    return {};
  }

  /**
   * Remove transformed styles from the document.
   *
   * @param {String} styleName
   * @returns {Boolean}
   */
  clear(styleName: string): boolean {
    return true;
  }
}
