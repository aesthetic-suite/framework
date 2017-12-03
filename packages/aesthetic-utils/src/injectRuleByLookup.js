/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { AtRuleMap, AtRuleCache, StyleDeclaration } from '../../types';

export default function injectRuleByLookup(
  properties: StyleDeclaration,
  propName: string,
  lookup: AtRuleMap | AtRuleCache,
  flatten?: boolean = false,
) {
  let value = properties[propName];

  if (typeof value !== 'string') {
    return;
  }

  value = value.split(',').map((name: string) => {
    name = name.trim();
    let found = lookup[name];

    if (found && Array.isArray(found)) {
      [found] = found;
    }

    return found || name;
  });

  if (flatten) {
    value = value.join(', ');
  } else if (value.length === 1) {
    [value] = value;
  }

  properties[propName] = value;
}
