/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';
import deepMerge from 'lodash.merge';

import type { ClassName, StyleDeclaration } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform(...styles: StyleDeclaration[]): ClassName {
    return String(css(deepMerge({}, ...styles)));
  }
}
