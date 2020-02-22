import ClientRenderer from './ClientRenderer';
import { CacheItem } from '../types';

const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/iu;

export default function addRuleToCache(
  renderer: ClientRenderer,
  rule: string,
  cache: Partial<CacheItem>,
) {
  const match = rule.match(RULE_PATTERN);

  if (!match) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`Failed to parse and hydrate rule: ${rule}`);
    }

    return;
  }

  const [, className, selector = '', property, value] = match;
  const val = value.endsWith(';') ? value.slice(0, -1) : value;

  renderer.classNameCache.write(property, val, {
    className,
    conditions: [],
    rank: 0,
    selector: selector.trim(),
    type: 'standard',
    ...cache,
  });
}
