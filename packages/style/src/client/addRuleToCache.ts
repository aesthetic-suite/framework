import ClientRenderer from './ClientRenderer';
import { CacheItem } from '../types';

const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/iu;

export default function addRuleToCache(
  renderer: ClientRenderer,
  rule: string,
  cache: Partial<CacheItem>,
) {
  const [, className, selector = '', property, value] = rule.match(RULE_PATTERN)!;

  renderer.classNameCache.write(property, value.endsWith(';') ? value.slice(0, -1) : value, {
    className,
    conditions: [],
    rank: 0,
    selector: selector.trim(),
    type: 'standard',
    ...cache,
  });
}
