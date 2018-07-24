/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';
import { ClassName, StyleSheetMap } from './types';

export default class ClassNameAdapter extends Adapter<StyleSheetMap<ClassName>, ClassName> {
  transform(...styles: ClassName[]): ClassName {
    const classNames: ClassName[] = [];

    styles.forEach(style => {
      if (style && typeof style === 'string') {
        classNames.push(style);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new TypeError(`${this.constructor.name} expects valid CSS class names.`);
      }
    });

    return classNames.join(' ');
  }
}
