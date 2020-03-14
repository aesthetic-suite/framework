import BaseStyleSheet from './BaseStyleSheet';

export default class StandardStyleSheet extends BaseStyleSheet {
  protected transientRank = -1;

  insertRule(rule: string): number {
    // CSS is locked in developer tools when using `insertRule`,
    // so avoid using it in development so we have full control.
    // istanbul ignore next
    if (process.env.NODE_ENV === 'development') {
      this.sheet.textContent += rule;
      this.transientRank += 1;

      return this.transientRank;
    }

    return this.sheet.insertRule(rule, this.sheet.cssRules.length);
  }
}
