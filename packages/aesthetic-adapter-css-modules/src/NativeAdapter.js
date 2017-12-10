/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';

import type { StyleSheet } from '../../types';

export default class CSSModulesAdapter extends Adapter {
  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    if (__DEV__) {
      if (this.native) {
        throw new Error('CSS modules do not support React Native.');
      }
    }

    const output = {};

    Object.keys(statement).forEach((selector) => {
      output[selector] = String(statement[selector]);
    });

    return output;
  }
}
