import { isMediaQueryCondition, isSupportsCondition } from '../helpers';

export default class TransientStyleRule {
  conditionText: string = '';

  cssRules: TransientStyleRule[] = [];

  cssText: string;

  type: number;

  constructor(type: number, cssText: string = '') {
    this.cssText = cssText;
    this.type = type;

    if (type === CSSRule.MEDIA_RULE || type === CSSRule.SUPPORTS_RULE) {
      this.conditionText = this.extractCondition();
    }
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
