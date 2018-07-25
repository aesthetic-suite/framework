/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import deepMerge from 'lodash/merge';
import UnifiedSyntax from './UnifiedSyntax';
import { ClassName, StyleName } from './types';

export default abstract class Adapter<
  StyleSheet,
  Declaration,
  ParsedStyleSheet = StyleSheet,
  ParsedDeclaration = Declaration
> {
  unifiedSyntax: UnifiedSyntax<StyleSheet, Declaration> | null = null;

  /**
   * Create a stylesheet from a component's style styleSheet.
   */
  create(styleSheet: StyleSheet, styleName: StyleName): ParsedStyleSheet {
    // @ts-ignore Allow spread
    return { ...styleSheet };
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
  abstract transform(...styles: ParsedDeclaration[]): ClassName;

  /**
   * Register handlers for unified syntax.
   */
  unify(syntax: UnifiedSyntax<StyleSheet, Declaration>) {}
}
