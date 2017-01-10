/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { MaybeClassName } from './types';

function stripChars(name: string): string {
  name = name.replace(/ /g, '');

  return (name.charAt(0) === '.') ? name.substring(1) : name;
}

export default function classNames(...values: MaybeClassName[]): string {
  const classes: string[] = [];

  values.forEach((value: MaybeClassName) => {
    // Empty value or failed condition
    if (!value) {
      return; // eslint-disable-line

    // Acceptable class name
    } else if (typeof value === 'string' || typeof value === 'number') {
      classes.push(stripChars(String(value)));

    // Array of possible class names
    } else if (Array.isArray(value)) {
      classes.push(classNames(...value));

    // Object of class names to boolean
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((key: string) => {
        // $FlowIssue We know its an object
        if (value[key]) {
          classes.push(stripChars(key));
        }
      });
    }
  });

  return classes.length ? classes.join(' ').trim() : '';
}
