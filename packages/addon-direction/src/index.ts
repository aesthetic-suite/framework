/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Direction } from '@aesthetic/types';
import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';

export default {
  convert<T extends string | number>(from: Direction, to: Direction, key: string, value: T) {
    if (from === to) {
      return { key, value };
    }

    return {
      key: getPropertyDoppelganger(key),
      value: getValueDoppelganger(key, value),
    };
  },
};
