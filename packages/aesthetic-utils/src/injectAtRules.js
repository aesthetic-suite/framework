/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { AtRuleMap, CSSStyle } from '../../types';

export default function injectAtRules(properties: CSSStyle, atName: string, rules: AtRuleMap) {
  // Font faces don't have IDs in their declaration,
  // so we need to handle this differently.
  if (atName === '@font-face') {
    const fonts = Object.keys(rules).map(key => rules[key]);

    if (fonts.length) {
      properties[atName] = (fonts.length > 1) ? fonts : fonts[0];
    }

  // All other at-rules work the same.
  } else {
    Object.keys(rules).forEach((key: string) => {
      properties[`${atName} ${key}`] = rules[key];
    });
  }
}
