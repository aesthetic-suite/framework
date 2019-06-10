import getFlushedStyles from './helpers/getFlushedStyles';
import purgeStyles from './helpers/purgeStyles';

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

  getFlushedStyles(): string {
    return getFlushedStyles(this.element);
  }

  injectRule(rule: string): this {
    this.sheet.insertRule(rule, this.sheet.cssRules.length);

    return this;
  }

  injectStatements(css: string): this {
    this.element.textContent += css;

    return this;
  }

  purgeStyles(): this {
    purgeStyles(this.element);

    return this;
  }
}
