import { isSSR } from '@aesthetic/utils';
import { StyleRule } from './types';

export default abstract class BaseStyleSheet {
  lastIndex: number = -1;

  sheet: StyleRule;

  protected rafHandle: number = 0;

  protected ruleBuffer: { index: number; rule: string }[] = [];

  constructor(sheet: StyleRule) {
    this.sheet = sheet;
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
        this.rafHandle = window.requestAnimationFrame(this.flushRules);
      }
    }

    return index;
  }

  protected injectRule = (rule: string, index: number) => {
    this.sheet.insertRule(rule, index);
    this.lastIndex = this.sheet.cssRules.length - 1;
  };

  protected flushRules = () => {
    this.rafHandle = 0;

    this.ruleBuffer.forEach((buffer) => {
      this.injectRule(buffer.rule, buffer.index);
    });

    this.ruleBuffer = [];
  };
}
