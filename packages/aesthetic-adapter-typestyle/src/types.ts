/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { types } from 'typestyle';

export type Declaration = types.NestedCSSProperties;

export interface StyleSheet {
  [selector: string]: Declaration;
}
