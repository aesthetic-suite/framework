/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic from './Aesthetic';
import { ClassName } from './types';

export default class ClassNameAesthetic<Theme extends object> extends Aesthetic<
  Theme,
  any,
  ClassName
> {
  transformToClassName(styles: any[]): ClassName {
    return styles.filter(style => style && typeof style === 'string').join(' ');
  }
}
