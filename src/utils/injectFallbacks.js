/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { CSSStyle } from '../types';

export default function injectFallbacks(properties: CSSStyle, fallbacks: CSSStyle) {
  Object.keys(fallbacks).forEach((propName: string) => {
    const prop = properties[propName];
    const fallback = fallbacks[propName];

    if (typeof prop === 'undefined') {
      return;
    }

    properties[propName] = [].concat(fallback, prop);
  });
}
