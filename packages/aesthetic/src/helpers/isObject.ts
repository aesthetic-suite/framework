/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default function isObject(value: any): value is object {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}
