import { formatUnit } from '../helpers';
import { BreakpointCondition } from '../types';

// All values are assumed to be px
export default class WebPlatform {
  readonly rootSize: number;

  constructor(rootSize: number) {
    this.rootSize = rootSize;
  }

  px(value: number): string {
    return `${formatUnit(value)}px`;
  }

  em(value: number): string {
    return `${formatUnit(value / this.rootSize)}em`;
  }

  rem(value: number): string {
    return `${formatUnit(value / this.rootSize)}rem`;
  }

  query(conditions: BreakpointCondition[]): string {
    return conditions.map(cond => `(${cond[0]}: ${this.em(cond[1])})`).join(' and ');
  }
}
