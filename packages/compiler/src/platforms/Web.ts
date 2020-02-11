import { formatUnit } from '../helpers';
import { BreakpointCondition } from '../types';

// All input values are assumed to be px
export default class WebPlatform {
  readonly rootTextSize: number;

  readonly spacingUnit: number;

  constructor(rootTextSize: number, spacingUnit: number) {
    this.rootTextSize = rootTextSize;
    this.spacingUnit = spacingUnit;
  }

  number(value: number): number {
    return Number(formatUnit(value));
  }

  px(value: number): string {
    return `${formatUnit(value)}px`;
  }

  em(value: number): string {
    return `${formatUnit(value / this.rootTextSize)}em`;
  }

  rem(value: number): string {
    return `${formatUnit(value / this.rootTextSize)}rem`;
  }

  unit(size: number): string {
    return this.rem(size * this.spacingUnit);
  }

  query(conditions: BreakpointCondition[]): string {
    return conditions.map(cond => `(${cond[0]}: ${this.em(cond[1])})`).join(' and ');
  }
}
