/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { Fallbacks, StyleDeclaration } from '../../types';

export default function injectFallbacks(properties: StyleDeclaration, fallbacks: Fallbacks) {
  Object.keys(fallbacks).forEach((propName) => {
    const prop = properties[propName];
    const fallback = fallbacks[propName];

    if (typeof prop === 'undefined') {
      return;
    }

    properties[propName] = [].concat(fallback, prop).map(value => String(value));
  });
}
