/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';

import type { TransformedDeclarations } from '../../types';

export default class CSSModulesAdapter extends Adapter {
  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    if (__DEV__) {
      if (this.native) {
        throw new Error('CSS modules do not support React Native.');
      }
    }

    const output = {};

    Object.keys(declarations).forEach((selector) => {
      output[selector] = `${styleName}-${String(declarations[selector])}`;
    });

    return output;
  }
}
