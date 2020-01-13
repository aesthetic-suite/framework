import { toArray } from 'aesthetic-utils';
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

      if (__DEV__) {
        if (!prop.name) {
          throw new Error(`Inline @keyframes requires an animation name.`);
        }
      }

      return parse(prop.name!, prop);
    })
    .join(', ');
}
