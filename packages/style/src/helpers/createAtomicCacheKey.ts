import { RenderOptions } from '../types';

export default function createAtomicCacheKey(rule: string, options: RenderOptions): string {
  let key = '';

  if (options.conditions) {
    key += options.conditions.join('');
  }

  // When using rule grouping, we need to make sure nested objects
  // inherit the same class name as their parent. Otherwise,
  // nested objects may aready be cached under another class name,
  // and we lose track of which ones to apply.
  if (options.deterministic && options.className) {
    key += options.className;
  }

  key += rule;

  return key.trim();
}
