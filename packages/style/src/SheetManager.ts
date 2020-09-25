import { CSS } from '@aesthetic/types';
import { isImportRule, isAtRule, formatConditions } from './helpers';
import { IMPORT_RULE, STYLE_RULE } from './constants';
import { Condition, SheetType, StyleRule } from './types';

export default class SheetManager {
  sheets: Record<SheetType, StyleRule>;

  constructor(sheets: Record<SheetType, StyleRule>) {
    this.sheets = sheets;
  }

  getSheet(type: SheetType): StyleRule {
    return this.sheets[type];
  }

  insertRule(type: SheetType, rule: CSS, conditions: Condition[] = []): number {
    if (conditions.length > 0) {
      return this.insertConditionRule(rule, conditions);
    } else if (isImportRule(rule)) {
      return this.insertImportRule(rule);
    } else if (isAtRule(rule)) {
      return this.insertAtRule(type, rule);
    }

    return this.injectRule(type, rule);
  }

  insertAtRule(type: SheetType, rule: CSS): number {
    const sheet = this.getSheet(type);
    const { length } = sheet.cssRules;
    let index = 0;

    // At-rules must be inserted before normal style rules.
    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (sheet.cssRules[i]?.type === STYLE_RULE) {
        break;
      }
    }

    return this.injectRule(type, rule, index);
  }

  insertConditionRule(rule: CSS, conditions: Condition[]): number {
    return this.injectRule('conditions', formatConditions(rule, conditions));
  }

  insertImportRule(rule: CSS): number {
    const sheet = this.getSheet('global');
    const { length } = sheet.cssRules;
    let index = 0;

    // Import rules must be inserted at the top of the style sheet,
    // but we also want to persist the existing order.
    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (sheet.cssRules[i]?.type !== IMPORT_RULE) {
        break;
      }
    }

    return this.injectRule('global', rule, index);
  }

  injectRule(type: SheetType, rule: string, index?: number): number {
    try {
      const sheet = this.getSheet(type);

      return sheet.insertRule(rule, index ?? sheet.cssRules.length);
    } catch {
      // Vendor prefixed properties, pseudos, etc, that are inserted
      // into different vendors will trigger a failure. For example,
      // `-moz` or `-ms` being inserted into WebKit.
      // There's no easy way around this, so let's just ignore the
      // error so that subsequent styles are inserted.
      return -1;
    }
  }
}
