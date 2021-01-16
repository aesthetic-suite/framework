import { Sheet, SheetType } from '@aesthetic/types';
// Rollup compatibility
import { formatDeclarationBlock, StyleEngine } from '../index';

function createStyleElement(type: SheetType, sheet: Sheet, ruleIndex: number): string {
  const lastIndex = sheet.cssRules.length - 1;
  let css = '';

  if (Object.keys(sheet.cssVariables).length > 0) {
    css += `:root { ${formatDeclarationBlock(sheet.cssVariables)} }`;
  }

  css += sheet.cssText;

  return `<style id="aesthetic-${type}" type="text/css" media="screen" data-aesthetic-type="${type}" data-aesthetic-hydrate-index="${lastIndex}" data-aesthetic-rule-index="${ruleIndex}">${css}</style>`;
}

export function renderToStyleMarkup(engine: StyleEngine): string {
  return (
    createStyleElement('global', engine.sheetManager.sheets.global, engine.ruleIndex) +
    createStyleElement('standard', engine.sheetManager.sheets.standard, engine.ruleIndex) +
    createStyleElement('conditions', engine.sheetManager.sheets.conditions, engine.ruleIndex)
  );
}
