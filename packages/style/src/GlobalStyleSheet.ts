import BaseStyleSheet from './BaseStyleSheet';

const IMPORT_PATTERN = /^@import/u;

export default class GlobalStyleSheet extends BaseStyleSheet {
  constructor() {
    super('global');
  }

  /**
   * Insert a rule into the global style sheet.
   */
  insertRule(rule: string): number {
    if (IMPORT_PATTERN.test(rule)) {
      return this.insertImportRule(rule);
    }

    return this.sheet.insertRule(rule, this.sheet.cssRules.length);
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

      if (this.sheet.cssRules[i]?.type !== CSSRule.IMPORT_RULE) {
        break;
      }
    }

    return this.sheet.insertRule(rule, index);
  }
}
