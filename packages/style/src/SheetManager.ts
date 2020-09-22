import { CSS } from '@aesthetic/types';
import { arrayLoop, isSSR } from '@aesthetic/utils';
import { isImportRule, isAtRule, formatConditions } from './helpers';
import { IMPORT_RULE, STYLE_RULE } from './constants';
import { Condition, SheetType, StyleRule } from './types';

interface RuleBuffer {
  index: number;
  rule: string;
  type: SheetType;
}

export default class SheetManager {
  sheets: Record<SheetType, StyleRule>;

  protected rafHandle: number = 0;

  protected ruleBuffer: RuleBuffer[] = [];

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
      return this.insertAtRule(rule);
    }

    return this.enqueueRule(type, rule);
  }

  insertAtRule(rule: CSS): number {
    const sheet = this.getSheet('global');
    const { length } = sheet.cssRules;
    let index = 0;

    // At-rules must be inserted before normal style rules.
    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (sheet.cssRules[i]?.type === STYLE_RULE) {
        break;
      }
    }

    return this.enqueueRule('global', rule, index);
  }

  insertConditionRule(rule: CSS, conditions: Condition[]): number {
    return this.enqueueRule('conditions', formatConditions(rule, conditions));
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

    return this.enqueueRule('global', rule, index);
  }

  protected enqueueRule(type: SheetType, rule: string, customIndex?: number): number {
    const sheet = this.getSheet(type);
    let index = 0;

    if (sheet.lastIndex === undefined) {
      sheet.lastIndex = -1;
    }

    // When testing or SSR, just insert the rule immediately
    if (process.env.NODE_ENV === 'test' || isSSR()) {
      index = customIndex ?? sheet.cssRules.length;

      this.injectRule(type, rule, index);

      // Otherwise buffer the insert until the next animation frame
    } else {
      index = customIndex ?? (sheet.lastIndex += 1);

      this.ruleBuffer.push({
        index,
        rule,
        type,
      });

      if (!this.rafHandle) {
        // Dont prepend `window.` to support React Native
        this.rafHandle = requestAnimationFrame(this.flushRules);
      }
    }

    return index;
  }

  protected injectRule = (type: SheetType, rule: string, index: number) => {
    const sheet = this.getSheet(type);

    try {
      sheet.insertRule(rule, index);
      sheet.lastIndex = sheet.cssRules.length - 1;
    } catch {
      // Vendor prefixed properties, pseudos, etc, that are inserted
      // into different vendors will trigger a failure. For example,
      // `-moz` or `-ms` being inserted into WebKit.
      // There's no easy way around this, so let's just ignore the
      // error so that subsequent styles are inserted.
    }
  };

  protected flushRules = () => {
    this.rafHandle = 0;

    arrayLoop(this.ruleBuffer, (buffer) => {
      this.injectRule(buffer.type, buffer.rule, buffer.index);
    });

    this.ruleBuffer = [];
  };
}
