import { isObject, toArray } from '@aesthetic/utils';
import transform from '../shorthand/transition';
import { Properties } from '../types';

export default function transition(property: Properties['transition']): string {
  if (!property) {
    return '';
  }

  return toArray(property)
    .map(prop => (isObject(prop) ? transform(prop) : prop))
    .join(', ');
}
