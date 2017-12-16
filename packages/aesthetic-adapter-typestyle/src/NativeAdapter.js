/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { TypeStyle } from 'typestyle';

import type { Statement, StyleSheet } from '../../types';

export default class TypeStyleAdapter extends Adapter {
  constructor(typeStyle?: TypeStyle, options?: Object = {}) {
    super(options);

    this.typeStyle = typeStyle || new TypeStyle({ autoGenerateTag: true });
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    const output = {};

    Object.keys(statement).forEach((selector) => {
      const value = statement[selector];

      output[selector] = (typeof value === 'string') ? value : this.typeStyle.style(value);
    });

    return output;
  }
}
