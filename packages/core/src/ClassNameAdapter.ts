import Adapter from './Adapter';
import { ClassName } from './types';

export default class ClassNameAdapter extends Adapter<{}, ClassName> {
  transformToClassName(styles: unknown[]): ClassName {
    return styles.filter(style => style && typeof style === 'string').join(' ');
  }
}
