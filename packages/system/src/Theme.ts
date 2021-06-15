/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import { ColorScheme, ContrastLevel, Unit, VariablesMap } from '@aesthetic/types';
import { deepMerge, hyphenate, isObject, objectLoop } from '@aesthetic/utils';
import type { Design } from './Design';
import { MIXIN_MAP } from './mixins';
import {
	DeepPartial,
	MixinType,
	ThemeOptions,
	ThemeTokens,
	Tokens,
	Utilities,
	VariableName,
} from './types';

export class Theme<T extends object> implements Utilities<T> {
	name: string = '';

	readonly contrast: ContrastLevel;

	readonly scheme: ColorScheme;

	readonly tokens: Tokens;

	private cssVariables?: VariablesMap;

	private design: Design<T>;

	constructor(options: ThemeOptions, tokens: ThemeTokens, design: Design<T>) {
		this.contrast = options.contrast;
		this.scheme = options.scheme;
		this.design = design;
		this.tokens = { ...design.tokens, ...tokens };
	}

	/**
	 * Extend and instantiate a new theme instance with customized tokens.
	 */
	extend(tokens: DeepPartial<ThemeTokens>, options: Partial<ThemeOptions> = {}): Theme<T> {
		return new Theme(
			{
				contrast: this.contrast,
				scheme: this.scheme,
				...options,
			},
			deepMerge(this.tokens, tokens),
			this.design,
		);
	}

	/**
	 * Return both design and theme tokens as a mapping of CSS variables.
	 */
	toVariables(): VariablesMap {
		if (this.cssVariables) {
			return this.cssVariables;
		}

		const vars: VariablesMap = {};
		const collapseTree = (data: Record<string, any>, path: string[]) => {
			objectLoop(data, (value, key) => {
				const nextPath = [...path, hyphenate(key)];

				if (isObject(value)) {
					collapseTree(value, nextPath);
				} else {
					vars[`--${nextPath.join('-')}`] = value;
				}
			});
		};

		collapseTree(this.tokens, []);

		this.cssVariables = vars;

		return this.cssVariables;
	}

	/**
	 * Return merged CSS properties from the defined mixin, all template overrides,
	 * and the provided additional CSS properties.
	 */
	mixin = (name: MixinType, rule?: T): T => {
		const properties: object = {};
		const mixin = MIXIN_MAP[name];

		if (mixin) {
			Object.assign(properties, mixin(this));
		} else if (__DEV__) {
			throw new Error(`Unknown mixin "${name}".`);
		}

		if (rule) {
			return deepMerge(properties, rule);
		}

		return properties as T;
	};

	/**
	 * Return a `rem` unit equivalent for the current spacing type and unit.
	 */
	unit = (...multipliers: number[]): Unit =>
		multipliers
			.map(
				(m) =>
					`${((this.design.spacingUnit * m) / this.design.rootTextSize)
						.toFixed(2)
						.replace('.00', '')}rem`,
			)
			.join(' ');

	/**
	 * Return a CSS variable declaration with the defined name and fallbacks.
	 */
	var = (name: VariableName, ...fallbacks: (number | string)[]): string =>
		`var(${[`--${name}`, ...fallbacks].join(', ')})`;
}
