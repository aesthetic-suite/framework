/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from '../../Adapter';

import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class CSSModulesAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    if (process.env.NODE_ENV === 'development') {
      if (this.native) {
        throw new Error('CSS modules do not support React Native.');
      }
    }

    const output = {};

    Object.keys(declarations).forEach((setName: string) => {
      output[setName] = `${styleName}-${String(declarations[setName])}`;
    });

    return output;
  }
}
