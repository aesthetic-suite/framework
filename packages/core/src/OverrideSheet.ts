import { ColorScheme, ContrastLevel } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { Sheet } from './Sheet';
import { SheetFactory, SheetParams } from './types';

export class OverrideSheet<Result, Block extends object> extends Sheet<Result, Block> {
	protected contrastOverrides: { [K in ContrastLevel]?: SheetFactory<Block> } = {};

	protected schemeOverrides: { [K in ColorScheme]?: SheetFactory<Block> } = {};

	protected themeOverrides: Record<string, SheetFactory<Block>> = {};

	addColorSchemeOverride(scheme: ColorScheme, factory: SheetFactory<Block>): this {
		if (__DEV__ && scheme !== 'light' && scheme !== 'dark') {
			throw new Error('Color scheme override must be one of "light" or "dark".');
		}

		this.schemeOverrides[scheme] = this.validateFactory(factory);

		return this;
	}

	addContrastOverride(contrast: ContrastLevel, factory: SheetFactory<Block>): this {
		if (__DEV__ && contrast !== 'normal' && contrast !== 'high' && contrast !== 'low') {
			throw new Error('Contrast level override must be one of "high", "low", or "normal".');
		}

		this.contrastOverrides[contrast] = this.validateFactory(factory);

		return this;
	}

	addThemeOverride(theme: string, factory: SheetFactory<Block>): this {
		this.themeOverrides[theme] = this.validateFactory(factory);

		return this;
	}

	override compose(params: SheetParams): SheetFactory<Block> {
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

		const composer: SheetFactory<Block> = (p) =>
			deepMerge(...factories.map((factory) => factory(p)));

		return composer;
	}
}
