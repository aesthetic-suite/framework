/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter, ClassName } from 'aesthetic';
import { css } from 'glamor';
import { StyleSheet, Declaration } from './types';

export default class GlamorAdapter extends Adapter<StyleSheet, Declaration> {
  transform(...styles: Declaration[]): ClassName {
    return String(css(this.merge(...styles)));
  }
}
