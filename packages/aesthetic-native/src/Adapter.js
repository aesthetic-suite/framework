/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from '../../aesthetic';

import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class ReactNativeAdapter extends Adapter {
  native: boolean = true;

  /**
   * Simply return the style declarations as-is because the RN `Aesthetic`
   * instance will automatically wrap it with RN `StyleSheet`.
   */
  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    return declarations;
  }
}
