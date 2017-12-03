/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { TransformedDeclarations } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform<S: Object>(styleName: string, declarations: S): TransformedDeclarations {
    if (__DEV__) {
      if (this.native) {
        throw new Error('Glamor does not support React Native.');
      }
    }

    const output = {};

    Object.keys(declarations).forEach((selector: string) => {
      const value = declarations[selector];

      if (typeof value === 'string') {
        output[selector] = this.native ? {} : value;
      } else {
        output[selector] = `${styleName}-${String(css(value))}`;
      }
    });

    return output;
  }
}
