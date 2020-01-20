import { formatUnit } from '../helpers';
import { BreakpointCondition } from '../types';

// All input values are assumed to be px
export default class WebPlatform {
  readonly rootSize: number;

  readonly spacingUnit: number;

  constructor(rootSize: number, spacingUnit: number) {
    this.rootSize = rootSize;
    this.spacingUnit = spacingUnit;
  }

  number(value: number): number {
    return Number(formatUnit(value));
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

  unit(size: number): string {
    return this.rem(size * this.spacingUnit);
  }

  query(conditions: BreakpointCondition[]): string {
    return conditions.map(cond => `(${cond[0]}: ${this.em(cond[1])})`).join(' and ');
  }
}
