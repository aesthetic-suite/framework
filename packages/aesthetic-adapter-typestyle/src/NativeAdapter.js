/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { TypeStyle } from 'typestyle';

import type { ClassName, StyleDeclaration } from '../../types';

export default class TypeStyleAdapter extends Adapter {
  constructor(typeStyle?: TypeStyle, options?: Object = {}) {
    super(options);

    this.typeStyle = typeStyle || new TypeStyle({ autoGenerateTag: true });
  }

  transform(...styles: StyleDeclaration[]): ClassName {
    return styles.map(style => this.typeStyle.style(style)).join(' ');
  }
}
