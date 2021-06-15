import { Theme } from '@aesthetic/system';
import {
	ColorScheme,
	ContrastLevel,
	Engine,
	RenderOptions,
	Rule,
	ThemeRule,
} from '@aesthetic/types';
import { arrayLoop, deepMerge, isObject, objectLoop, toArray } from '@aesthetic/utils';
import { BaseSheetFactory, RenderResultSheet, SheetParams } from './types';

const CLASS_NAME = /^[a-z]{1}[a-z0-9-_]+$/iu;

function createCacheKey(params: Required<SheetParams>, type: string): string | null {
	let key = type;

	// Since all other values are scalars, we can just join the values.
	// This is 3x faster than JSON.stringify(), and 1.5x faster than Object.values()!
	objectLoop(params, (value) => {
		key += String(value);
	});

	return key;
}

export class StyleSheet<Result, Factory extends BaseSheetFactory> {
	readonly type: 'global' | 'local';

	protected contrastOverrides: { [K in ContrastLevel]?: Factory } = {};

	protected factory: Factory;

	protected renderCache: Record<string, RenderResultSheet<Result>> = {};

	protected schemeOverrides: { [K in ColorScheme]?: Factory } = {};

	protected themeOverrides: Record<string, Factory> = {};

	constructor(type: 'global' | 'local', factory: Factory) {
		this.type = type;
		this.factory = this.validateFactory(factory);
	}

	addColorSchemeOverride(scheme: ColorScheme, factory: Factory): this {
		if (__DEV__) {
			if (this.type !== 'local') {
				throw new Error('Color scheme overrides are only supported by local style sheets.');
			}

			if (scheme !== 'light' && scheme !== 'dark') {
				throw new Error('Color scheme override must be one of "light" or "dark".');
			}
		}

		this.schemeOverrides[scheme] = this.validateFactory(factory);

		return this;
	}

	addContrastOverride(contrast: ContrastLevel, factory: Factory): this {
		if (__DEV__) {
			if (this.type !== 'local') {
				throw new Error('Contrast level overrides are only supported by local style sheets.');
			}

			if (contrast !== 'normal' && contrast !== 'high' && contrast !== 'low') {
				throw new Error('Contrast level override must be one of "high", "low", or "normal".');
			}
		}

		this.contrastOverrides[contrast] = this.validateFactory(factory);

		return this;
	}

	addThemeOverride(theme: string, factory: Factory): this {
		if (__DEV__ && this.type !== 'local') {
			throw new Error('Theme overrides are only supported by local style sheets.');
		}

		this.themeOverrides[theme] = this.validateFactory(factory);

		return this;
	}

	compose(params: SheetParams): Factory {
		if (this.type === 'global') {
			return this.factory;
		}

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

		const composer: BaseSheetFactory = (p) => deepMerge(...factories.map((factory) => factory(p)));

		return composer as Factory;
	}

	render(
		engine: Engine<Result>,
		// This is hidden behind abstractions, so is ok
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		theme: Theme<any>,
		baseParams: SheetParams,
	): RenderResultSheet<Result> {
		const params: Required<SheetParams> = {
			contrast: theme.contrast,
			direction: 'ltr',
			scheme: theme.scheme,
			theme: theme.name,
			unit: 'px',
			vendor: false,
			...baseParams,
		};
		const key = createCacheKey(params, this.type);
		const cache = key && this.renderCache[key];

		if (cache) {
			return cache;
		}

		const composer = this.compose(params);
		const styles = composer(theme);
		const renderOptions: RenderOptions = {
			direction: params.direction,
			unit: params.unit,
			vendor: params.vendor,
		};

		const resultSheet =
			this.type === 'global'
				? this.parseGlobal(engine, styles, renderOptions)
				: this.parseLocal(
						engine,
						// @ts-expect-error Be explicit later
						styles,
						renderOptions,
				  );

		if (key) {
			this.renderCache[key] = resultSheet;
		}

		return resultSheet;
	}

	protected parseGlobal(
		engine: Engine<Result>,
		theme: ThemeRule,
		options: RenderOptions,
	): RenderResultSheet<Result> {
		const resultSheet: RenderResultSheet<Result> = { root: {} };

		objectLoop(theme['@font-face'], (fontFaces, fontFamily) => {
			arrayLoop(toArray(fontFaces), (fontFace) =>
				engine.renderFontFace({ ...fontFace, fontFamily }, options),
			);
		});

		arrayLoop(toArray(theme['@import']), (importPath) => engine.renderImport(importPath!, options));

		objectLoop(theme['@keyframes'], (keyframes, animationName) => {
			engine.renderKeyframes(keyframes, animationName, options);
		});

		if (theme['@root']) {
			resultSheet.root!.result = engine.renderRuleGrouped(theme['@root'], {
				...options,
				type: 'global',
			}).result;
		}

		if (theme['@variables']) {
			engine.setRootVariables(theme['@variables']);
		}

		return resultSheet;
	}

	protected parseLocal(
		engine: Engine<Result>,
		styles: Record<string, Rule | string>,
		options: RenderOptions,
	): RenderResultSheet<Result> {
		const resultSheet: RenderResultSheet<Result> = {};
		const rankings = {};

		objectLoop(styles, (style, selector) => {
			// eslint-disable-next-line no-multi-assign
			const meta = (resultSheet[selector] ||= {});

			// At-rule
			if (selector.startsWith('@')) {
				if (__DEV__) {
					throw new SyntaxError(
						`At-rules may not be defined at the root of a style sheet, found "${selector}".`,
					);
				}

				// Class name
			} else if (typeof style === 'string' && style.match(CLASS_NAME)) {
				meta.result = style as unknown as Result;

				// Rule
			} else if (isObject(style)) {
				const result = engine.renderRule(style, { ...options, rankings });

				meta.result = result.result;

				if (result.variants.length > 0) {
					const types = new Set<string>();

					arrayLoop(result.variants, (variant) => {
						arrayLoop(variant.types, (type) => {
							types.add(type.split(':')[0]);
						});
					});

					meta.variants = result.variants;
					meta.variantTypes = types;
				}

				// Unknown
			} else if (__DEV__) {
				throw new Error(
					`Invalid rule for "${selector}". Must be an object (style declaration) or string (class name).`,
				);
			}
		});

		return resultSheet;
	}

	protected validateFactory(factory: Factory): Factory {
		if (__DEV__) {
			const typeOf = typeof factory;

			if (typeOf !== 'function') {
				throw new TypeError(`A style sheet factory function is required, found "${typeOf}".`);
			}
		}

		return factory;
	}
}
