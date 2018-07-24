/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default function joinProperties(...items: any[]): any[] {
  const value: any[] = [];

  items.forEach(item => {
    if (Array.isArray(item)) {
      value.push(...item);
    } else if (typeof item !== 'undefined') {
      value.push(item);
    }
  });

  return value;
}
