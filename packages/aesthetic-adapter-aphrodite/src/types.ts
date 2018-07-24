/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { StyleSheetMap } from 'aesthetic';
import { CSSProperties } from 'aphrodite';

export type Declaration = CSSProperties;

export type StyleSheet = StyleSheetMap<Declaration>;

export interface ParsedDeclaration {
  _len: number;
  _name: string;
  _definition: Declaration;
}

export type ParsedStyleSheet = StyleSheetMap<ParsedDeclaration>;
