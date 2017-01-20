/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet } from 'react-native';
import Aesthetic from '../Aesthetic';

import type { TransformedStylesMap, StyleDeclaration } from '../types';

export default class NativeAesthetic extends Aesthetic {
  native: boolean = true;

  /**
   * Pass the transformed styles through React Native's `StyleSheet` layer.
   */
  transformStyles(styleName: string, themeName: string = ''): TransformedStylesMap {
    return StyleSheet.create(super.transformStyles(styleName, themeName));
  }

  /**
   * The logic for React Native is reversed.
   */
  validateTransform(styleName: string, setName: string, value: StyleDeclaration): StyleDeclaration {
    if (__DEV__) {
      if (typeof value === 'string') {
        throw new TypeError(
          'React Native requires style objects to be returned from the adapter. ' +
          `"${styleName}@${setName}" is a string.`,
        );
      }
    }

    return value;
  }
}
