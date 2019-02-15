import Aesthetic from './Aesthetic';
import { ClassName } from './types';

export default class ClassNameAesthetic<Theme extends object> extends Aesthetic<
  Theme,
  any,
  ClassName
> {
  protected transformToClassName(styles: any[]): ClassName {
    return styles.filter(style => style && typeof style === 'string').join(' ');
  }
}
