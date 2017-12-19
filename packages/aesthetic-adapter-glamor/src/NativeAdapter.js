/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { StyleDeclaration } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform(styles: StyleDeclaration[]): string {
    return css(...styles);
  }
}
