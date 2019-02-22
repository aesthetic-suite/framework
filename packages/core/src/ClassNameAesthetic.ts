import { ClassName } from 'unified-css-syntax';
import Aesthetic from './Aesthetic';

export default class ClassNameAesthetic<Theme extends object> extends Aesthetic<
  Theme,
  any,
  ClassName
> {
  protected transformToClassName(styles: any[]): ClassName {
    return styles.filter(style => style && typeof style === 'string').join(' ');
  }
}
