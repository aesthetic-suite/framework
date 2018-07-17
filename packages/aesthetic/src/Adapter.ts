/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import deepMerge from 'lodash/merge';
import { ClassName, Declaration, StyleSheet } from './types';

export default class Adapter<T = Declaration, To = {}> {
  options: To;

  constructor(options: Partial<To> = {}) {
    // @ts-ignore
    this.options = { ...options };
  }

  /**
   * Create a stylesheet from a component's style styleSheet.
   */
  // TODO
  create(styleSheet: any, styleName: string): StyleSheet<T> {
    return styleSheet;
  }

  /**
   * Deep merge multiple style declarations.
   */
  merge(...styles: any[]): any {
    return deepMerge({}, ...styles);
  }

  /**
   * Transform the style declarations using the registered adapter.
   */
  transform(...styles: T[]): ClassName {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
