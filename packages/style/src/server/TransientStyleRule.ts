import { arrayReduce } from '@aesthetic/utils';
import { isImportRule, isMediaRule, isSupportsRule } from '../helpers';
import {
  MEDIA_RULE,
  SUPPORTS_RULE,
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
} from '../constants';
import { StyleRule, CSSVariables } from '../types';

export default class TransientStyleRule implements StyleRule {
  conditionText: string = '';

  cssRules: StyleRule[] = [];

  cssVariables: CSSVariables<string> = {};

  textContent: string = '';

  type: number;

  protected rule: string;

  constructor(type: number, rule: string = '') {
    this.rule = rule;
    this.type = type;

    if (type === MEDIA_RULE || type === SUPPORTS_RULE) {
      this.conditionText = this.extractCondition();
    }
  }

  get cssText() {
    return arrayReduce(this.cssRules, (rule) => rule.cssText, this.rule);
  }

  determineType(rule: string): number {
    if (isMediaRule(rule)) {
      return MEDIA_RULE;
    } else if (isSupportsRule(rule)) {
      return SUPPORTS_RULE;
    } else if (rule.startsWith('@font-face')) {
      return FONT_FACE_RULE;
    } else if (rule.startsWith('@keyframes')) {
      return KEYFRAMES_RULE;
    } else if (isImportRule(rule)) {
      return IMPORT_RULE;
    }

    return STYLE_RULE;
  }

  extractCondition(): string {
    return this.cssText.split('{')[0].replace('@media', '').replace('@supports', '').trim();
  }

  insertRule(rule: string, index: number): number {
    this.cssRules.splice(index, 0, new TransientStyleRule(this.determineType(rule), rule));

    return index;
  }
}
