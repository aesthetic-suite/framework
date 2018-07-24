/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { FontFace } from '../types';

/**
 * Replace a `animationName` property with keyframe objects of the same name.
 */
export default function injectKeyframes<D>(
  value: any,
  cache: { [animationName: string]: D },
): (string | D)[] {
  return String(value)
    .split(',')
    .map(name => {
      const animationName = name.trim();

      return cache[animationName] || animationName;
    });
}
