import ServerRenderer from './ServerRenderer';
import formatDeclarationBlock from '../helpers/formatDeclarationBlock';
import { StyleRule, SheetType, ProcessedProperties } from '../types';

function createElement(type: SheetType, rule: StyleRule, index: number): string {
  let css = '';

  if (Object.keys(rule.cssVariables).length > 0) {
    css += `:root { ${formatDeclarationBlock(rule.cssVariables as ProcessedProperties)} }`;
  }

  css += rule.cssText;

  return `<style id="aesthetic-${type}" type="text/css" media="screen" data-aesthetic-type="${type}" data-aesthetic-hydrate="${index}">${css}</style>`;
}

export default function renderToStyleMarkup(renderer: ServerRenderer): string {
  return (
    createElement('global', renderer.getRootRule('global'), renderer.ruleIndex) +
    createElement('standard', renderer.getRootRule('standard'), renderer.ruleIndex) +
    createElement('conditions', renderer.getRootRule('conditions'), renderer.ruleIndex)
  );
}
