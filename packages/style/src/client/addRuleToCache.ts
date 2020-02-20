import ClientRenderer from './ClientRenderer';
import { CacheItem } from '../types';

const RULE_PATTERN = /^\.(\w+)((:|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/iu;

export default function addRuleToCache(
  renderer: ClientRenderer,
  rule: string,
  cache: Partial<CacheItem>,
) {
  const match = rule.match(RULE_PATTERN);

  if (!match) {
    if (__DEV__) {
      console.log(`Failed to parse and hydrate rule: ${rule}`);
    }

    return;
  }

  const [, className, selector = '', property, value] = match;

  renderer.classNameCache.write(property, value, {
    className,
    conditions: [],
    rank: 0,
    selector,
    type: '',
    ...cache,
  });
}
