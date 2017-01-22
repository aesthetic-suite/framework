/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet } from 'react-native';
import Adapter from '../Adapter';
import Aesthetic from '../Aesthetic';
import ReactNativeAdapter from './Adapter';

import type { TransformedStylesMap, StyleDeclaration } from '../types';

export default class ReactNativeAesthetic extends Aesthetic {
  native: boolean = true;

  constructor(adapter: Adapter) {
    super(adapter || new ReactNativeAdapter());
  }

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
    if (process.env.NODE_ENV === 'development') {
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
