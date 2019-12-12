import { getFlushedStyles, purgeStyles } from 'aesthetic-utils';

export default class StyleSheetManager {
  private element: HTMLStyleElement | null = null;

  private sheet: CSSStyleSheet | null = null;

  getFlushedStyles(): string {
    return getFlushedStyles(this.getStyleElement());
  }

  getStyleElement(): HTMLStyleElement {
    if (this.element) {
      return this.element;
    }

    this.element = document.createElement('style');
    this.element.type = 'text/css';
    this.element.media = 'screen';
    this.element.setAttribute('data-aesthetic', 'true');

    document.head.append(this.element);

    // This must happen after the element is inserted into the DOM,
    // otherwise the value is null.
    this.sheet = this.element.sheet as CSSStyleSheet;

    return this.element;
  }

  injectRule(rule: string): this {
    this.getStyleElement();
    this.sheet!.insertRule(rule, this.sheet!.cssRules.length);

    return this;
  }

  injectStatements(css: string): this {
    this.getStyleElement().textContent += css;

    return this;
  }

  purgeStyles(): this {
    purgeStyles(this.getStyleElement());

    return this;
  }
}
