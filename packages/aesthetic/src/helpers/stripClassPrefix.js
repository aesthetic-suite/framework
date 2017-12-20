/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default function stripClassPrefix(name: string): string {
  return (name.charAt(0) === '.') ? name.substring(1) : name;
}
