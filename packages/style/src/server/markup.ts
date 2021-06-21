import { Sheet, SheetType } from '@aesthetic/types';
import { nonce, objectReduce } from '@aesthetic/utils';

// Rollup compatibility
import { formatVariableBlock, StyleEngine } from '..';

export function extractCssFromSheet(sheet: Sheet): string {
	let css = '';

	if (Object.keys(sheet.cssVariables).length > 0) {
		css += `:root { ${formatVariableBlock(sheet.cssVariables)} }`;
	}

	css += sheet.cssText;

	return css;
}

export function getStyleElementAttributes(
	type: SheetType,
	sheet: Sheet,
	ruleCount: number,
): Record<string, number | string | undefined> {
	return {
		'data-aesthetic-hydrate-index': sheet.cssRules.length - 1,
		'data-aesthetic-rule-count': ruleCount,
		'data-aesthetic-type': type,
		id: `aesthetic-${type}`,
		media: 'screen',
		nonce: nonce(),
		type: 'text/css',
	};
}

function createStyleElement(type: SheetType, sheet: Sheet, ruleCount: number): string {
	const css = extractCssFromSheet(sheet);
	const attrs = objectReduce(getStyleElementAttributes(type, sheet, ruleCount), (value, key) =>
		value === undefined ? '' : ` ${key}="${value}"`,
	);

	return `<style ${attrs}>${css}</style>`;
}

export function renderToStyleMarkup(engine: StyleEngine): string {
	return (
		createStyleElement('global', engine.sheetManager.sheets.global, engine.ruleCount) +
		createStyleElement('standard', engine.sheetManager.sheets.standard, engine.ruleCount) +
		createStyleElement('conditions', engine.sheetManager.sheets.conditions, engine.ruleCount)
	);
}
