/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Adapter, ClassName } from 'aesthetic';
import { TypeStyle } from 'typestyle';
import { StyleSheet, Declaration } from './types';

export default class TypeStyleAdapter extends Adapter<StyleSheet, Declaration> {
  typeStyle: TypeStyle;

  constructor(typeStyle?: TypeStyle) {
    super();

    this.typeStyle = typeStyle || new TypeStyle({ autoGenerateTag: true });
  }

  transform(...styles: Declaration[]): ClassName {
    return this.typeStyle.style(this.merge(...styles));
  }
}
