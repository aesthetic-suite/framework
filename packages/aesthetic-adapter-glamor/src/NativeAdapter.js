/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { css } from 'glamor';
import { Adapter } from '../../aesthetic';

import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    if (process.env.NODE_ENV === 'development') {
      if (this.native) {
        throw new Error('Glamor does not support React Native.');
      }
    }

    const output = {};

    Object.keys(declarations).forEach((setName: string) => {
      const value = declarations[setName];

      if (typeof value === 'string') {
        output[setName] = this.native ? {} : value;
      } else {
        output[setName] = `${styleName}-${String(css(value))}`;
      }
    });

    return output;
  }
}
