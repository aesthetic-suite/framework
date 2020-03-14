import formatDeclarationBlock from '../helpers/formatDeclarationBlock';
import { StyleRule, SheetType } from '../types';

export default function createStyleElement(
  type: SheetType,
  rule: StyleRule,
  index: number,
): string {
  let css = '';

  if (Object.keys(rule.cssVariables).length > 0) {
    css += `:root { ${formatDeclarationBlock(rule.cssVariables)} }`;
  }

  css += rule.cssText;

  return `<style id="aesthetic-${type}" type="text/css" media="screen" data-aesthetic-type="${type}" data-aesthetic-hydrate="${index}">${css}</style>`;
}
