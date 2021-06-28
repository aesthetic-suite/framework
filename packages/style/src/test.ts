import {
	CacheManager,
	ClassName,
	CSS,
	EngineOptions,
	Sheet,
	SheetManager,
	SheetType,
} from '@aesthetic/types';
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
