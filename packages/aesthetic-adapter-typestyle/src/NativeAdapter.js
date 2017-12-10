/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { style } from 'typestyle';

import type { StyleSheet } from '../../types';

export default class TypeStyleAdapter extends Adapter {
  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    if (__DEV__) {
      if (this.native) {
        throw new Error('TypeStyle does not support React Native.');
      }
    }

    const output = {};

    Object.keys(statement).forEach((selector) => {
      const value = statement[selector];

      output[selector] = (typeof value === 'string') ? value : style(value);
    });

    return output;
  }
}
