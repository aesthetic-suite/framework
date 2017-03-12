/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet } from 'react-native';
import Aesthetic, { Adapter } from '../../aesthetic';
import ReactNativeAdapter from './Adapter';

import type { TransformedStylesMap, StyleDeclaration } from '../../types';

export default class ReactNativeAesthetic extends Aesthetic {
  native: boolean = true;

  constructor(adapter: Adapter, options: Object = {}) {
    super(adapter || new ReactNativeAdapter(), {
      stylesPropName: 'styles',
      ...options,
    });
  }

  /**
   * Pass the transformed styles through React Native's `StyleSheet` layer.
   */
  transformStyles(styleName: string, themeName: string = ''): TransformedStylesMap {
    const styles = super.transformStyles(styleName, themeName);

    // Some adapters call `StyleSheet` themselves,
    // so we need to avoid doing it twice.
    if (this.adapter.bypassNativeStyleSheet) {
      return styles;
    }

    return StyleSheet.create(styles);
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
