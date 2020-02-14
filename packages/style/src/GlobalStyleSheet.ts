import BaseStyleSheet from './BaseStyleSheet';

export default class GlobalStyleSheet extends BaseStyleSheet {
  constructor() {
    super('global');
  }

  insertRule(rule: string): number {
    return this.sheet.insertRule(rule, this.sheet.cssRules.length);
  }
}
