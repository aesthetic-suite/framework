import { CSS } from '@aesthetic/types';
import { isSSR } from '@aesthetic/utils';
import { isImportRule, isAtRule, getDocumentStyleSheet } from './helpers';
import { IMPORT_RULE, STYLE_RULE } from './constants';
import { SheetType, StyleRule } from './types';

export default class StyleSheet {
  lastIndex: number = -1;

  readonly sheet: StyleRule;

  readonly type: SheetType;

  protected rafHandle: number = 0;

  protected ruleBuffer: { index: number; rule: string }[] = [];

  constructor(type: SheetType, sheet?: StyleRule) {
    this.type = type;
    this.sheet = sheet || ((getDocumentStyleSheet(type) as unknown) as StyleRule);
  }

  insertRule(rule: CSS, other?: unknown): number {
    if (this.type === 'global') {
      if (isImportRule(rule)) {
        return this.insertImportRule(rule);
      }

      if (isAtRule(rule)) {
        return this.insertAtRule(rule);
      }
    }

    return this.enqueueRule(rule);
  }

  insertAtRule(rule: CSS): number {
    const { length } = this.sheet.cssRules;
    let index = 0;

    // At-rules must be inserted before normal style rules.
    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (this.sheet.cssRules[i]?.type === STYLE_RULE) {
        break;
      }
    }

    return this.enqueueRule(rule, index);
  }

  insertImportRule(rule: CSS): number {
    const { length } = this.sheet.cssRules;
    let index = 0;

    // Import rules must be inserted at the top of the style sheet,
    // but we also want to persist the existing order.
    for (let i = 0; i <= length; i += 1) {
      index = i;

      if (this.sheet.cssRules[i]?.type !== IMPORT_RULE) {
        break;
      }
    }

    return this.enqueueRule(rule, index);
  }

  protected enqueueRule(rule: string, customIndex?: number): number {
    let index = 0;

    // When testing or SSR, just insert the rule immediately
    if (process.env.NODE_ENV === 'test' || isSSR()) {
      index = customIndex ?? this.sheet.cssRules.length;

      this.injectRule(rule, index);

      // Otherwise buffer the insert until the next animation frame
    } else {
      index = customIndex ?? (this.lastIndex += 1);

      this.ruleBuffer.push({
        index,
        rule,
      });

      if (!this.rafHandle) {
        // Dont prepend `window.` to support React Native
        this.rafHandle = requestAnimationFrame(this.flushRules);
      }
    }

    return index;
  }

  protected injectRule = (rule: string, index: number) => {
    try {
      this.sheet.insertRule(rule, index);
      this.lastIndex = this.sheet.cssRules.length - 1;
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

    this.ruleBuffer.forEach((buffer) => {
      this.injectRule(buffer.rule, buffer.index);
    });

    this.ruleBuffer = [];
  };
}
