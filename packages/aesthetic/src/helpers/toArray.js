/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default function toArray(value: *): *[] {
  return Array.isArray(value) ? value : [value];
}
