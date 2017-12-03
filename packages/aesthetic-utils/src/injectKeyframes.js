/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { AtRuleCache, Keyframes, StyleDeclaration } from '../../types';

export default function injectKeyframes(
  properties: StyleDeclaration,
  keyframes: Keyframes | AtRuleCache<string>,
  flatten?: boolean = false,
) {
  let value = String(properties.animationName).split(',').map((name) => {
    const animationName = name.trim();

    return keyframes[animationName] || animationName;
  });

  if (flatten) {
    value = value.join(', ');
  }

  // $FlowIgnore Allow arrays here TODO
  properties.animationName = value;
}
