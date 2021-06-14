import { ColorShade } from '@aesthetic/system';

export function formatShade(value: number | string): ColorShade {
	return String(value).padStart(2, '0').slice(0, 2) as ColorShade;
}

export function formatUnit(value: number): string {
	return value.toFixed(2).replace('.00', '');
}
