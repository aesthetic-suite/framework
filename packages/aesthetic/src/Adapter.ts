/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import deepMerge from 'lodash/merge';
import { ClassName, StyleSheet } from './types';

export default class Adapter<Declaration, Options = {}> {
  options: Options;

  constructor(options: Partial<Options> = {}) {
    // @ts-ignore
    this.options = { ...options };
  }

  /**
   * Create a stylesheet from a component's style styleSheet.
   */
  // TODO
  create<T>(styleSheet: T, styleName: string): StyleSheet<Declaration> {
    return styleSheet;
  }

  /**
   * Deep merge multiple style declarations.
   */
  merge(...styles: Declaration[]): any {
    return deepMerge({}, ...styles);
  }

  /**
   * Transform the style declarations using the registered adapter.
   */
  transform(...styles: Declaration[]): ClassName {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
