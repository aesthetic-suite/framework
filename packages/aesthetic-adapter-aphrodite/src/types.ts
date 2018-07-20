/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { StyleDeclaration } from 'aphrodite';

export interface Declaration {
  _len: number;
  _name: string;
  _definition: StyleDeclaration;
}

export interface StyleSheet {
  [selector: string]: Declaration;
}
