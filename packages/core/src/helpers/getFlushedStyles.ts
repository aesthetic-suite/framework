import hasQueryCondition from './hasQueryCondition';
import toArray from './toArray';

export default function getFlushedStyles(styles: HTMLStyleElement | HTMLStyleElement[]): string {
  return toArray(styles).reduce((css, style) => {
    const sheet = style.sheet as CSSStyleSheet;
    let content = '';

    if (sheet && sheet.cssRules) {
      content = Array.from(sheet.cssRules)
        .map(rule => rule.cssText)
        .join('\n');
    } else if (style.textContent) {
      content = style.textContent;
    }

    if (!content) {
      return css;
    }

    if (style.media && hasQueryCondition(style.media)) {
      content = `@media ${style.media} { ${content} }`;
    }

    return `${css}\n${content}`.trim();
  }, '');
}
