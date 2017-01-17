/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { StyleSheet } from 'react-native';
import Adapter from '../Adapter';

import type { StyleDeclarationMap } from '../types';

export default class ReactNativeAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarationMap): StyleDeclarationMap {
    return StyleSheet.create(declarations);
  }
}
