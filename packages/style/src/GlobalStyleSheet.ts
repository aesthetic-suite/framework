import BaseStyleSheet from './BaseStyleSheet';
import { isImportRule, isAtRule } from './helpers';
import { IMPORT_RULE, STYLE_RULE } from './constants';

export default class GlobalStyleSheet extends BaseStyleSheet {
  /**
   * Insert a rule into the global style sheet.
   */
  insertRule(rule: string): number {
    if (isImportRule(rule)) {
      return this.insertImportRule(rule);
    }

    if (isAtRule(rule)) {
      return this.insertAtRule(rule);
    }

    return this.enqueueRule(rule);
  }

  /**
   * At-rules must be inserted before normal style rules.
   */
  insertAtRule(rule: string): number {
    const { length } = this.sheet.cssRules;
    let index = 0;

    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (this.sheet.cssRules[i]?.type === STYLE_RULE) {
        break;
      }
    }

    return this.enqueueRule(rule, index);
  }

  /**
   * Import rules must be inserted at the top of the style sheet,
   * but we also want to persist the existing order.
   */
  insertImportRule(rule: string): number {
    const { length } = this.sheet.cssRules;
    let index = 0;

    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (this.sheet.cssRules[i]?.type !== IMPORT_RULE) {
        break;
      }
    }

    return this.enqueueRule(rule, index);
  }
}
