/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { AtRuleMap, AtRuleCache, CSSStyle } from '../types';

export default function injectRuleByLookup(
  properties: CSSStyle,
  propName: string,
  lookup: AtRuleMap | AtRuleCache,
  flatten: boolean = false,
) {
  let value = properties[propName];

  if (typeof value !== 'string') {
    return;
  }

  value = value.split(',').map((name: string) => {
    let found = lookup[name.trim()];

    if (found && Array.isArray(found)) {
      found = found[0];
    }

    return found || name;
  });

  if (flatten) {
    value = value.join(',');
  }

  properties[propName] = value;
}
