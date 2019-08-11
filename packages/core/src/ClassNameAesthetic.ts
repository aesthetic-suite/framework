import Aesthetic from './Aesthetic';
import { ClassName } from './types';

export default class ClassNameAesthetic<Theme extends object> extends Aesthetic<
  Theme,
  {},
  ClassName
> {
  transformToClassName(styles: unknown[]): ClassName {
    return styles.filter(style => style && typeof style === 'string').join(' ');
  }
}
