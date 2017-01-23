/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default function isPrimitive<T>(value: T): boolean {
  const type = (typeof value);

  return (type === 'string' || type === 'number' || type === 'boolean');
}
