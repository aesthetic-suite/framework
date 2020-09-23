import { Value } from '@aesthetic/types';
import { RenderOptions } from '../types';

export default function createAtomicCacheKey(
  options: RenderOptions,
  prop: string,
  value: Value,
): string {
  let key = `${prop}:${value}`;

  if (options.selector) {
    key += options.selector;
  }

  if (options.conditions) {
    key += options.conditions.join('');
  }

  return key;
}
