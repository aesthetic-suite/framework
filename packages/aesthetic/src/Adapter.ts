/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import deepMerge from 'lodash/merge';
import UnifiedSyntax from './UnifiedSyntax';
import { ClassName, StyleName, StyleSheetMap } from './types';

export default abstract class Adapter<ParsedBlock> {
  /**
   * Bootstrap the adapter with the unified syntax layer, allowing events to be registered.
   */
  abstract bootstrap(syntax: UnifiedSyntax<any>): void;

  /**
   * Create an adapter native style sheet from an Aesthetic style sheet.
   */
  createStyleSheet<T>(styleSheet: T, styleName: StyleName): StyleSheetMap<ParsedBlock> {
    // @ts-ignore
    return { ...styleSheet };
  }

  /**
   * Deep merge multiple style or theme declarations.
   */
  mergeDeclarations<T>(...styles: T[]): T {
    return deepMerge({}, ...styles);
  }

  /**
   * Transform the style declarations into CSS class names.
   */
  abstract transformToClassName(...styles: ParsedBlock[]): ClassName;
}
