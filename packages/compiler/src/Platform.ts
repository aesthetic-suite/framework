import { formatUnit } from './helpers';
import { FormatType } from './types';

// All input values are assumed to be px
export default abstract class Platform {
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

  px(value: number): string {
    return `${formatUnit(value)}px`;
  }

  spacing(size: number): number {
    return size * this.spacingUnit;
  }

  abstract unit(value: number): number | string;
}
