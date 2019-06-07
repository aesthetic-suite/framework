/* eslint-disable no-param-reassign */

export default function purgeStyles(styles: HTMLStyleElement[]) {
  styles.forEach(style => {
    style.textContent = '';

    const sheet = style.sheet as CSSStyleSheet;

    if (sheet) {
      Array.from(sheet.cssRules).forEach((rule, index) => {
        sheet.deleteRule(index);
      });
    }
  });
}
