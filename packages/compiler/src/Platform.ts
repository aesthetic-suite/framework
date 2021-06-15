import { FONT_FAMILIES } from './constants';
import { formatUnit } from './helpers';
import { FormatType, PlatformType } from './types';

export abstract class Platform {
	readonly rootTextSize: number;

	readonly spacingUnit: number;

	readonly format: FormatType;

	constructor(format: FormatType, rootTextSize: number, spacingUnit: number) {
		this.format = format;
		this.rootTextSize = rootTextSize;
		this.spacingUnit = spacingUnit;
	}

	font(type: 'monospace' | 'system', platform?: PlatformType) {
		return FONT_FAMILIES[`${platform ?? this.format.split('-')[0]}-${type}` as 'web-system'];
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
