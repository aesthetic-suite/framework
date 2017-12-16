/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { Statement, StyleSheet } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform(styleName: string, statement: Statement): StyleSheet {
    if (__DEV__) {
      if (this.native) {
        throw new Error('Glamor does not support React Native.');
      }
    }

    const output = {};

    Object.keys(statement).forEach((selector) => {
      const value = statement[selector];

      output[selector] = (typeof value === 'string') ? value : String(css(value));
    });

    return output;
  }
}
