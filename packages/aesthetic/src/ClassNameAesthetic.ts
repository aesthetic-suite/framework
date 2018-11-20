/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic from './Aesthetic';
import { ClassName } from './types';

export default class ClassNameAesthetic<Theme> extends Aesthetic<Theme, ClassName> {
  protected transformToClassName(styles: ClassName[]): ClassName {
    return styles.filter(style => style && typeof style === 'string').join(' ');
  }
}
