/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic, { Adapter } from 'aesthetic';
import { StyleSheet } from 'react-native';
import ReactNativeAdapter from './Adapter';

import type { StyleDeclaration, StyleSheet as AestheticStyleSheet } from '../../types';

export default class ReactNativeAesthetic extends Aesthetic {
  native: boolean = true;

  constructor(adapter: Adapter, options?: Object = {}) {
    super(adapter || new ReactNativeAdapter(), {
      stylesPropName: 'styles',
      ...options,
    });
  }

  /**
   * Pass the transformed styles through React Native's `StyleSheet` layer.
   */
  transformStyles(styleName: string, themeName?: string): AestheticStyleSheet {
    const styles = super.transformStyles(styleName, themeName);

    // Some adapters call `StyleSheet` themselves, so we need to avoid doing it twice
    if (this.adapter.bypassNativeStyleSheet) {
      return styles;
    }

    return StyleSheet.create(styles);
  }

  /**
   * The logic for React Native is reversed.
   */
  validateTransform(
    styleName: string,
    selector: string,
    value: StyleDeclaration,
  ): StyleDeclaration {
    if (__DEV__) {
      if (typeof value === 'string') {
        throw new TypeError(
          'React Native requires style objects to be returned from the adapter. ' +
          `"${styleName}@${selector}" is a string.`,
        );
      }
    }

    return value;
  }
}
