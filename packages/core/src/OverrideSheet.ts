import { Utilities } from '@aesthetic/system';
import { ColorScheme, ContrastLevel } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { Sheet } from './Sheet';
import { SheetFactory, SheetParams } from './types';

export class OverrideSheet<
	Input extends object,
	Output,
	Factory extends SheetFactory<Input>,
> extends Sheet<Input, Output, Factory> {
	protected contrastOverrides: { [K in ContrastLevel]?: Factory } = {};

	protected schemeOverrides: { [K in ColorScheme]?: Factory } = {};

	protected themeOverrides: Record<string, Factory> = {};

	addColorSchemeOverride(scheme: ColorScheme, factory: Factory): this {
		if (__DEV__ && scheme !== 'light' && scheme !== 'dark') {
			throw new Error('Color scheme override must be one of "light" or "dark".');
		}

		this.schemeOverrides[scheme] = this.validateFactory(factory);

		return this;
	}

	addContrastOverride(contrast: ContrastLevel, factory: Factory): this {
		if (__DEV__ && contrast !== 'normal' && contrast !== 'high' && contrast !== 'low') {
			throw new Error('Contrast level override must be one of "high", "low", or "normal".');
		}

		this.contrastOverrides[contrast] = this.validateFactory(factory);

		return this;
	}

	addThemeOverride(theme: string, factory: Factory): this {
		this.themeOverrides[theme] = this.validateFactory(factory);

		return this;
	}

	override compose(params: SheetParams): Factory {
		const factories = [this.factory];

		if (params.scheme && this.schemeOverrides[params.scheme]) {
			factories.push(this.schemeOverrides[params.scheme]!);
		}

		if (params.contrast && this.contrastOverrides[params.contrast]) {
			factories.push(this.contrastOverrides[params.contrast]!);
		}

		if (params.theme && this.themeOverrides[params.theme]) {
			factories.push(this.themeOverrides[params.theme]!);
		}

		if (factories.length === 1) {
			return factories[0];
		}

		const composer = (utils: Utilities<Input>) =>
			deepMerge(...factories.map((factory) => factory(utils)));

		return composer as Factory;
	}
}
