/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { CSSProperties } from 'aphrodite';

export type NativeBlock = CSSProperties;

export interface ParsedBlock {
  _len: number;
  _name: string;
  _definition: NativeBlock;
}
