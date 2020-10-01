import { formatDeclarationBlock, SheetType, StyleEngine, StyleRule } from '../index';

function createStyleElement(type: SheetType, rule: StyleRule, ruleIndex: number): string {
  const lastIndex = rule.cssRules.length - 1;
  let css = '';

  if (Object.keys(rule.cssVariables).length > 0) {
    css += `:root { ${formatDeclarationBlock(rule.cssVariables)} }`;
  }

  css += rule.cssText;

  return `<style id="aesthetic-${type}" type="text/css" media="screen" data-aesthetic-type="${type}" data-aesthetic-hydrate-index="${lastIndex}" data-aesthetic-rule-index="${ruleIndex}">${css}</style>`;
}

export default function renderToStyleMarkup(engine: StyleEngine): string {
  return (
    createStyleElement('global', engine.sheetManager.sheets.global, engine.ruleIndex) +
    createStyleElement('standard', engine.sheetManager.sheets.standard, engine.ruleIndex) +
    createStyleElement('conditions', engine.sheetManager.sheets.conditions, engine.ruleIndex)
  );
}
