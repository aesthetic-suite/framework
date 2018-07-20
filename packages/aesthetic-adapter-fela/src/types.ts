/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { IStyle } from 'fela';

export interface Declaration extends IStyle {}

export interface StyleSheet {
  [selector: string]: Declaration;
}
