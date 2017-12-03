/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { StyleDeclaration } from '../../types';

export default function injectFallbacks(properties: StyleDeclaration, fallbacks: StyleDeclaration) {
  Object.keys(fallbacks).forEach((propName: string) => {
    const prop = properties[propName];
    const fallback = fallbacks[propName];

    if (typeof prop === 'undefined') {
      return;
    }

    properties[propName] = [].concat(fallback, prop);
  });
}
