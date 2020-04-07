import { hyphenate } from '@aesthetic/utils';
import { formatUnit } from '../helpers';
import { BreakpointCondition, FormatType } from '../types';

// All input values are assumed to be px
export default class WebPlatform {
  readonly rootTextSize: number;

  readonly spacingUnit: number;

  readonly format: FormatType;

  constructor(format: FormatType, rootTextSize: number, spacingUnit: number) {
    this.format = format;
    this.rootTextSize = rootTextSize;
    this.spacingUnit = spacingUnit;
  }

  number(value: number): number {
    return Number(formatUnit(value));
  }

  property(value: string): string {
    return hyphenate(value);
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

  var = (value: string): string => {
    if (this.format === 'web-sass' || this.format === 'web-scss') {
      return `$${value}`;
    }

    if (this.format === 'web-less') {
      return `@${value}`;
    }

    return `var(--${value})`;
  };

  query(conditions: BreakpointCondition[]): string {
    return conditions.map((cond) => `(${cond[0]}: ${this.em(cond[1])})`).join(' and ');
  }
}
