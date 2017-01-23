/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default function toArray<T>(value: T): T[] {
  return Array.isArray(value) ? value : [value];
}
