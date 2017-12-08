/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { TransformedDeclarations } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    if (__DEV__) {
      if (this.native) {
        throw new Error('Glamor does not support React Native.');
      }
    }

    const output = {};

    Object.keys(declarations).forEach((selector) => {
      const value = declarations[selector];

      output[selector] = (typeof value === 'string') ? value : String(css(value));
    });

    return output;
  }
}
