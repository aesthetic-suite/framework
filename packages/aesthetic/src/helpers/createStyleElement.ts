/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default function createStyleElement(id: string): HTMLElement {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.id = `aesthetic-${id}`;

  document.head.appendChild(style);

  return style;
}
