import {
	CacheManager,
	ClassName,
	CSS,
	Engine,
	EngineOptions,
	RenderOptions,
	RenderResult,
	Rule,
	Sheet,
	SheetManager,
	SheetType,
} from '@aesthetic/types';
import { hyphenate, objectLoop } from '@aesthetic/utils';
// Rollup compatibility
import {
	createCacheManager,
	createSheetManager,
	createStyleElements,
	createStyleEngine,
	getStyleElement,
	StyleEngine,
} from '.';

export function createTestCacheManager(): CacheManager<ClassName> {
	return createCacheManager();
}

export function createTestSheetManager(): SheetManager {
	return createSheetManager(createStyleElements());
}

export function createTestStyleEngine(
	options: Partial<EngineOptions<ClassName>> = {},
): StyleEngine {
	return createStyleEngine({
		cacheManager: createTestCacheManager(),
		sheetManager: createTestSheetManager(),
		...options,
	});
}

export function createTestEngine(): Engine<Rule, ClassName> {
	const noop = () => {};

	const renderVariable = (name: string) => `variable:${hyphenate(name)}`;

	const renderRule = (rule: Rule, options: RenderOptions = {}): RenderResult<ClassName> => {
		let result = String(options.debugName ?? 'class');

		objectLoop(rule['@variables'], (value, name) => {
			result += ` ${renderVariable(name)}`;
		});

		return {
			result,
			variants: Object.keys(rule['@variants'] ?? {}).map((variant) => {
				const types = variant.split('+').map((v) => v.trim());

				return {
					result: types.map((v) => `variant:${hyphenate(v)}`).join(' '),
					types,
				};
			}),
		};
	};

	const engine: Engine<Rule, ClassName> = {
		direction: 'ltr',
		prefersColorScheme: () => false,
		prefersContrastLevel: () => false,
		renderDeclaration: (prop) => `property:${hyphenate(prop)}`,
		renderFontFace: () => 'font-face',
		renderImport: () => 'import',
		renderKeyframes: (keyframes, name) => `keyframes:${hyphenate(name ?? 'unknown')}`,
		renderRule,
		renderRuleGrouped: renderRule,
		renderVariable,
		ruleCount: 0,
		setDirection: noop,
		setRootVariables: noop,
		setTheme: noop,
	};

	return engine;
}

export function getRenderedStyles(type: Sheet | SheetType): CSS {
	return [...(typeof type === 'string' ? getStyleElement(type) : type).cssRules].reduce(
		(css, rule) => css + rule.cssText,
		'',
	);
}

export function purgeStyles(type?: SheetType): void {
	if (type) {
		// This is the only way to generate accurate snapshots.
		// It may slow down tests though?
		document.querySelector(`#aesthetic-${type}`)?.remove();
	} else {
		purgeStyles('global');
		purgeStyles('standard');
		purgeStyles('conditions');
	}
}
