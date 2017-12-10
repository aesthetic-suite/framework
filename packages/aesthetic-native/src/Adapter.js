/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';

import type { StyleSheet } from '../../types';

export default class ReactNativeAdapter extends Adapter {
  native: boolean = true;

  /**
   * Simply return the style declarations as-is because the RN `Aesthetic`
   * instance will automatically wrap it with RN `StyleSheet`.
   */
  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    return statement;
  }
}
