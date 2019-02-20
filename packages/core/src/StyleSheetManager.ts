export default class StyleSheetManager {
  private element: HTMLStyleElement;

  private sheet: CSSStyleSheet;

  constructor() {
    this.element = document.createElement('style');
    this.element.type = 'text/css';
    this.element.media = 'screen';
    this.element.setAttribute('data-aesthetic', 'true');

    document.head.append(this.element);

    // This must happen after the element is inserted into the DOM,
    // otherwise the value is null.
    this.sheet = this.element.sheet as CSSStyleSheet;
  }

  getInjectedStyles(): string {
    return (
      (this.element.textContent || '') +
      Array.from(this.sheet.cssRules)
        .map(rule => rule.cssText)
        .join('')
    );
  }

  injectRule(rule: string): this {
    this.sheet.insertRule(rule, this.sheet.cssRules.length);

    return this;
  }

  injectStatements(css: string): this {
    this.element.textContent += css;

    return this;
  }
}
