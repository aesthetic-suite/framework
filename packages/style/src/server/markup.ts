import { Sheet, SheetType } from '@aesthetic/types';
import { nonce, objectReduce } from '@aesthetic/utils';
// Rollup compatibility
import { formatDeclarationBlock, StyleEngine } from '../index';

export function extractCssFromSheet(sheet: Sheet): string {
  let css = '';

  if (Object.keys(sheet.cssVariables).length > 0) {
    css += `:root { ${formatDeclarationBlock(sheet.cssVariables)} }`;
  }

  css += sheet.cssText;

  return css;
}

export function getStyleElementAttributes(
  type: SheetType,
  sheet: Sheet,
  ruleIndex: number,
): Record<string, number | string | undefined> {
  return {
    'data-aesthetic-hydrate-index': sheet.cssRules.length - 1,
    'data-aesthetic-rule-index': ruleIndex,
    'data-aesthetic-type': type,
    id: `aesthetic-${type}`,
    media: 'screen',
    nonce: nonce(),
    type: 'text/css',
  };
}

function createStyleElement(type: SheetType, sheet: Sheet, ruleIndex: number): string {
  const css = extractCssFromSheet(sheet);
  const attrs = objectReduce(getStyleElementAttributes(type, sheet, ruleIndex), (value, key) =>
    value === undefined ? '' : ` ${key}="${value}"`,
  );

  return `<style ${attrs}>${css}</style>`;
}

export function renderToStyleMarkup(engine: StyleEngine): string {
  return (
    createStyleElement('global', engine.sheetManager.sheets.global, engine.ruleIndex) +
    createStyleElement('standard', engine.sheetManager.sheets.standard, engine.ruleIndex) +
    createStyleElement('conditions', engine.sheetManager.sheets.conditions, engine.ruleIndex)
  );
}
