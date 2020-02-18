import ServerRenderer from './ServerRenderer';
import formatDeclarationBlock from '../helpers/formatDeclarationBlock';
import { StyleRule, SheetType } from '../types';

function createElement(type: SheetType, rule: StyleRule): string {
  let css = '';

  if (Object.keys(rule.cssVariables).length > 0) {
    css += `:root { ${formatDeclarationBlock(rule.cssVariables)} }`;
  }

  css += rule.cssText;

  return `<style id="aesthetic-${type}" type="text/css" media="screen" data-aesthetic-hydrate="true">${css}</style>`;
}

export default function renderToStyleMarkup(renderer: ServerRenderer): string {
  return (
    createElement('global', renderer.getRootRule('global')) +
    createElement('standard', renderer.getRootRule('standard')) +
    createElement('conditions', renderer.getRootRule('conditions'))
  );
}
