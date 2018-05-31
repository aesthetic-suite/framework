/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import deepMerge from 'lodash/merge';

import type { ClassName, StyleDeclaration, StyleSheet } from '../../types';

export default class Adapter {
  options: Object = {};

  constructor(options?: Object = {}) {
    this.options = { ...options };
  }

  /**
   * Create a stylesheet from a component's style styleSheet.
   */
  create(styleSheet: StyleSheet, styleName: string): StyleSheet {
    return styleSheet;
  }

  /**
   * Deep merge multiple style declarations.
   */
  merge(...styles: Object[]): Object {
    return deepMerge({}, ...styles);
  }

  /**
   * Transform the style declarations using the registered adapter.
   */
  transform(...styles: StyleDeclaration[]): ClassName {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
