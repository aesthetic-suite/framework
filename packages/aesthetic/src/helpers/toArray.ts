/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
