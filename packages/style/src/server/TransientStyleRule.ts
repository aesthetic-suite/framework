import { isMediaQueryCondition, isSupportsCondition } from '../helpers';
import { StyleRule } from '../types';

export default class TransientStyleRule implements StyleRule {
  conditionText: string = '';

  cssRules: StyleRule[] = [];

  cssVariables: StyleRule['cssVariables'] = {};

  type: number;

  protected rule: string;

  constructor(type: number, rule: string = '') {
    this.rule = rule;
    this.type = type;

    if (type === CSSRule.MEDIA_RULE || type === CSSRule.SUPPORTS_RULE) {
      this.conditionText = this.extractCondition();
    }
  }

  get cssText() {
    let css = this.rule;

    for (let i = 0; i < this.cssRules.length; i += 1) {
      css += this.cssRules[i].cssText;
    }

    return css;
  }

  determineType(rule: string): number {
    if (isMediaQueryCondition(rule)) {
      return CSSRule.MEDIA_RULE;
    } else if (isSupportsCondition(rule)) {
      return CSSRule.SUPPORTS_RULE;
    } else if (rule.startsWith('@font-face')) {
      return CSSRule.FONT_FACE_RULE;
    } else if (rule.startsWith('@keyframes')) {
      return CSSRule.KEYFRAMES_RULE;
    } else if (rule.startsWith('@import')) {
      return CSSRule.IMPORT_RULE;
    }

    return CSSRule.STYLE_RULE;
  }

  extractCondition(): string {
    return this.cssText
      .split('{')[0]
      .replace('@media', '')
      .replace('@supports', '')
      .trim();
  }

  insertRule(rule: string, index: number): number {
    this.cssRules.splice(index, 0, new TransientStyleRule(this.determineType(rule), rule));

    return index;
  }
}
