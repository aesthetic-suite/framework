/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import deepMerge from 'lodash/merge';
import { ClassName, StyleName } from './types';

export default abstract class Adapter<StyleSheet, Declaration> {
  /**
   * Create a stylesheet from a component's style styleSheet.
   */
  create(styleSheet: any, styleName: StyleName): StyleSheet {
    return styleSheet;
  }

  /**
   * Deep merge multiple style declarations.
   */
  merge<T>(...styles: T[]): T {
    return deepMerge({}, ...styles);
  }

  /**
   * Transform the style declarations using the registered adapter.
   */
  abstract transform(...styles: Declaration[]): ClassName;
}
