/* eslint-disable no-param-reassign */

export default function getFlushedStyles(styles: HTMLStyleElement[]): string {
  return styles.reduce((css, style) => {
    if (style.textContent) {
      css += style.textContent;
    } else if (style.sheet) {
      css += Array.from((style.sheet as CSSStyleSheet).cssRules)
        .map(rule => rule.cssText)
        .join('');
    }

    return css;
  }, '');
}
