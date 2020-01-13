import { toArray, isObject } from 'aesthetic-utils';
import transform from '../shorthand/animation';
import { Properties } from '../types';

export default function animation(property: Properties['animation']): string {
  if (!property) {
    return '';
  }

  return toArray(property)
    .map(prop => (isObject(prop) ? transform(prop) : prop))
    .join(', ');
}
