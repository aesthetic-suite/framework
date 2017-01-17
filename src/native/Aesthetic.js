/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet } from 'react-native';
import Aesthetic from '../Aesthetic';

import type { TransformedStylesMap } from '../types';

export default class NativeAesthetic extends Aesthetic {
  native: boolean = true;

  /**
   * Pass the transformed styles through React Native's `StyleSheet` layer.
   */
  transformStyles(styleName: string, themeName: string = ''): TransformedStylesMap {
    return StyleSheet.create(super.transformStyles(styleName, themeName));
  }
}
