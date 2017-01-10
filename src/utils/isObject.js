/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default function isObject<T>(value: T): boolean {
  return (value !== null && !Array.isArray(value) && typeof value === 'object');
}
