/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { CSSStyle, CSSStyleValue } from 'aesthetic';

function isPrimitive<T>(value: T): boolean {
  const type = (typeof value);

  return (type === 'string' || type === 'number' || type === 'boolean');
}

export default function injectFallbacks(properties: CSSStyle, fallbacks: CSSStyle) {
  Object.keys(fallbacks).forEach((propName: string) => {
    const prop = properties[propName];
    const fallback = fallbacks[propName];

    if (typeof prop === 'undefined') {
      return;
    }

    const list = [];

    // We have to be verbose here because Flow is being finnicky
    if (Array.isArray(fallback)) {
      fallback.forEach((backValue: CSSStyleValue) => {
        if (isPrimitive(backValue)) {
          list.push(backValue);
        }
      });
    } else if (isPrimitive(fallback)) {
      list.push(fallback);
    }

    if (!Array.isArray(prop) && isPrimitive(prop)) {
      list.push(prop);
    }

    properties[propName] = list;
  });
}
