/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { StyleSheetMap } from 'aesthetic';
import { StyleDeclaration } from 'aphrodite';

export interface Declaration {
  _len: number;
  _name: string;
  _definition: StyleDeclaration;
}

export type ParsedStyleSheet = StyleSheetMap<Declaration>;

export type StyleSheet = StyleSheetMap<StyleDeclaration>;
