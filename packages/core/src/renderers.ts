import { Engine, RenderOptions, ThemeRule } from '@aesthetic/types';
import { arrayLoop, isObject, objectLoop, toArray } from '@aesthetic/utils';
import { SheetRenderResult } from './types';

export function renderTheme<Input, Output>(
	engine: Engine<Input, Output>,
	theme: ThemeRule<Input>,
	options: RenderOptions,
): SheetRenderResult<Output> {
	const resultSheet: SheetRenderResult<Output> = { root: {} };

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

export function renderComponent<Input, Output>(
	engine: Engine<Input, Output>,
	styles: Record<string, Input>,
	options: RenderOptions,
): SheetRenderResult<Output> {
	const resultSheet: SheetRenderResult<Output> = {};
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
