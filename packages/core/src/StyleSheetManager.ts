import getFlushedStyles from './helpers/getFlushedStyles';

export default class StyleSheetManager {
  private element?: HTMLStyleElement;

  private sheet?: CSSStyleSheet;

  constructor() {
    this.createStyleElement();
  }

  createStyleElement(): this {
    if (this.element) {
      return this;
    }

    this.element = document.createElement('style');
    this.element.type = 'text/css';
    this.element.media = 'screen';
    this.element.setAttribute('data-aesthetic', 'true');

    document.head.append(this.element);

    // This must happen after the element is inserted into the DOM,
    // otherwise the value is null.
    this.sheet = this.element.sheet as CSSStyleSheet;

    return this;
  }

  getFlushedStyles(): string {
    return this.element ? getFlushedStyles([this.element]) : '';
  }

  injectRule(rule: string): this {
    this.sheet!.insertRule(rule, this.sheet!.cssRules.length);

    return this;
  }

  injectStatements(css: string): this {
    this.element!.textContent += css;

    return this;
  }

  purgeFlushedStyles(): this {
    this.element!.remove();
    this.createStyleElement();

    return this;
  }
}
