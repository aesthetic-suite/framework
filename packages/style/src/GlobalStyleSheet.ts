import BaseStyleSheet from './BaseStyleSheet';

const IMPORT_PATTERN = /^@import/u;

export default class GlobalStyleSheet extends BaseStyleSheet {
  constructor() {
    super('global');
  }

  insertRule(rule: string): number {
    // Imports must appear at the top of the document
    const index = IMPORT_PATTERN.test(rule) ? 0 : this.sheet.cssRules.length;

    return this.sheet.insertRule(rule, index);
  }
}
