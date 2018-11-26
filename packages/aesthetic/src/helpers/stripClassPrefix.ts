/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default function stripClassPrefix(name: string): string {
  return name.charAt(0) === '.' ? name.substring(1) : name;
}
