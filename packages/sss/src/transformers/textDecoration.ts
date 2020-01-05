import { TextDecorationProperty } from '../types';
import { join } from '../transformProperty';

export default function transformTextDecoration(prop: TextDecorationProperty): string {
  return join(prop.line, prop.style, prop.color, prop.thickness);
}
