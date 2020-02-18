import ServerRenderer from './ServerRenderer';
import { StyleRule, SheetType } from '../types';

function createElement(type: SheetType, rule: StyleRule): string {
  let css = '';

  for (let i = 0; i < rule.cssRules.length; i += 1) {
    css += rule.cssRules[i].cssText;
  }

  return `<style id="aesthetic-${type}" type="text/css" media="screen" data-aesthetic-hydrate="true">${css}</style>`;
}

export default function renderToStyleMarkup(renderer: ServerRenderer): string {
  return (
    createElement('global', renderer.getRootRule('global')) +
    createElement('standard', renderer.getRootRule('standard')) +
    createElement('conditions', renderer.getRootRule('conditions'))
  );
}
