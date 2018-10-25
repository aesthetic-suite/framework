/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { StyleSheetMap } from 'aesthetic';
import { CSSProperties } from 'aphrodite';

export type Properties = CSSProperties;

export interface ParsedDeclaration {
  _len: number;
  _name: string;
  _definition: Properties;
}

export type ParsedStyleSheet = StyleSheetMap<ParsedDeclaration>;
