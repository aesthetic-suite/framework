/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { ClassName } from '../../types';

function stripChars(name: string): string {
  return (name.charAt(0) === '.') ? name.substring(1) : name;
}

export default function classes(...values: *[]): ClassName {
  const classNames: string[] = [];

  values.forEach((value) => {
    // Empty value or failed condition
    if (!value) {
      return; // eslint-disable-line

    // Acceptable class name
    } else if (typeof value === 'string' || typeof value === 'number') {
      classNames.push(stripChars(String(value)));

    // Array of possible class names
    } else if (Array.isArray(value)) {
      classNames.push(classes(...value));

    // Object of class names to boolean
    } else if (typeof value === 'object' && value) {
      Object.keys(value).forEach((key) => {
        if (value[key]) {
          classNames.push(stripChars(key));
        }
      });
    }
  });

  return classNames.join(' ').trim();
}
