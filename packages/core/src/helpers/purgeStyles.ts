/* eslint-disable no-param-reassign */

import toArray from './toArray';

export default function purgeStyles(styles: HTMLStyleElement | HTMLStyleElement[]) {
  toArray(styles).forEach(style => {
    style.textContent = '';

    const sheet = style.sheet as CSSStyleSheet;

    if (sheet && sheet.cssRules) {
      Array.from(sheet.cssRules).forEach((rule, index) => {
        sheet.deleteRule(index);
      });
    }
  });
}
