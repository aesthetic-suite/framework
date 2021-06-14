import { formatUnit } from '../helpers';
import Platform from '../Platform';
import { BreakpointCondition } from '../types';

// All input values are assumed to be px
export default class WebPlatform extends Platform {
	em(value: number): string {
		return `${formatUnit(value / this.rootTextSize)}em`;
	}

	rem(value: number): string {
		return `${formatUnit(value / this.rootTextSize)}rem`;
	}

	unit(value: number): number | string {
		return this.rem(value);
	}

	query(conditions: BreakpointCondition[]): string {
		const clause = conditions.map((cond) => `(${cond[0]}: ${this.em(cond[1])})`).join(' and ');

		return `screen and ${clause}`;
	}
}
