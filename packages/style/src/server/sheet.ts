import { Variables } from '@aesthetic/types';
import { arrayReduce } from '@aesthetic/utils';
import sortMediaQueries from 'sort-css-media-queries';
import {
  MEDIA_RULE,
  SUPPORTS_RULE,
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  StyleRule,
} from '../index';
import { SheetManager, SheetMap } from '../types';

export function sortConditionalRules(sheet: StyleRule) {
  sheet.cssRules = sheet.cssRules.sort((a, b) =>
    sortMediaQueries(a.conditionText, b.conditionText),
  );
}

export class TransientSheet implements StyleRule {
  conditionText: string = '';

  cssRules: StyleRule[] = [];

  cssVariables: Variables<string> = {};

  textContent: string = '';

  type: number;

  protected rule: string;

  constructor(type: number = STYLE_RULE, rule: string = '') {
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
    this.cssRules.splice(index, 0, new TransientSheet(this.determineType(rule), rule));

    return index;
  }

  protected get conditionAtRule() {
    return this.type === MEDIA_RULE ? '@media' : '@supports';
  }

  protected determineType(rule: string): number {
    if (rule[0] !== '@') {
      return STYLE_RULE;
    }

    if (rule.startsWith('@media')) {
      return MEDIA_RULE;
    } else if (rule.startsWith('@supports')) {
      return SUPPORTS_RULE;
    } else if (rule.startsWith('@font-face')) {
      return FONT_FACE_RULE;
    } else if (rule.startsWith('@keyframes')) {
      return KEYFRAMES_RULE;
    } else if (rule.startsWith('@import')) {
      return IMPORT_RULE;
    }

    return STYLE_RULE;
  }
}

function findNestedRule(sheet: StyleRule, query: string, type: number) {
  for (let i = 0; i < sheet.cssRules.length; i += 1) {
    const child = sheet.cssRules[i];

    if (child && child.type === type && child.conditionText === query) {
      return child;
    }
  }

  return null;
}

export function createSheetManager(sheets: SheetMap): SheetManager {
  return {
    insertRule(type, rule, index) {
      const sheet = sheets[type];

      if (isImportRule(rule)) {
        return insertImportRule(sheet, rule);
      } else if (isAtRule(rule)) {
        return insertAtRule(sheet, rule);
      }

      return insertRule(sheet, rule, index);
    },
    sheets,
  };
}
