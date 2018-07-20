/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Declaration } from 'aesthetic';

export { Declaration };

export interface StyleSheet {
  [selector: string]: Declaration;
}
