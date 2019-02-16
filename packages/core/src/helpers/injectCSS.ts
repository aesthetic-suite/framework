let styleElement: HTMLStyleElement;

export default function injectCSS(css: string) {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    document.head.append(styleElement);
  }

  const sheet = styleElement.sheet as CSSStyleSheet | null;

  if (sheet) {
    sheet.insertRule(css, sheet.cssRules.length);
  }
}
