import { toArray } from '@aesthetic/utils';
import { Properties, Keyframes } from '../types';

export default function animationName(
  property: Properties['animationName'],
  parse: (name: string, frames: Keyframes) => string,
): string {
  if (!property) {
    return '';
  }

  return toArray(property)
    .map(prop => {
      if (typeof prop === 'string') {
        return prop;
      }

      return parse(prop.name!, prop);
    })
    .join(', ');
}
