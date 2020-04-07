import BaseStyleSheet from './BaseStyleSheet';

export default class StandardStyleSheet extends BaseStyleSheet {
  insertRule(rule: string): number {
    return this.enqueueRule(rule);
  }
}
