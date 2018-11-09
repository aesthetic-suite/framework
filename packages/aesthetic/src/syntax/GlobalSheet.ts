/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Sheet from './Sheet';

export default class GlobalSheet<Block> extends Sheet<Block> {
  charset: string = 'utf8';

  fontFaces: any[] = [];

  imports: string[] = [];
}
