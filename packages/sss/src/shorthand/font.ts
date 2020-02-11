import { FontProperty } from '../types';
import { join, divide } from '../transform';

export default function transformFont(prop: FontProperty): string {
  if (prop.system) {
    return prop.system;
  }

  return join(
    prop.style,
    prop.variant,
    prop.weight,
    prop.stretch,
    divide(prop.size, prop.lineHeight),
    prop.family,
  );
}
