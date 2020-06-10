import { Variables } from '@aesthetic/types';
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
import { StyleRule } from '../types';

export default class TransientStyleRule implements StyleRule {
  conditionText: string = '';

  cssRules: StyleRule[] = [];

  cssVariables: Variables<string> = {};

  textContent: string = '';

  type: number;

  protected rule: string;

  constructor(type: number, rule: string = '') {
    this.rule = rule;
    this.type = type;

    if (type === MEDIA_RULE || type === SUPPORTS_RULE) {
      this.rule = '';
      this.conditionText = rule
        .slice(0, rule.indexOf('{') - 1)
        .replace(this.conditionAtRule, '')
        .trim();
    }
  }

  get cssText() {
    const css = arrayReduce(this.cssRules, (rule) => rule.cssText, this.rule);

    if (this.type === MEDIA_RULE || this.type === SUPPORTS_RULE) {
      return `${this.conditionAtRule} ${this.conditionText} { ${css} }`;
    }

    return css;
  }

  insertRule(rule: string, index: number): number {
    this.cssRules.splice(index, 0, new TransientStyleRule(this.determineType(rule), rule));

    return index;
  }

  protected get conditionAtRule() {
    return this.type === MEDIA_RULE ? '@media' : '@supports';
  }

  protected determineType(rule: string): number {
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
}
