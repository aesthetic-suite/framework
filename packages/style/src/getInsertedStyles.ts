import getDocumentStyleSheet from './getDocumentStyleSheet';
import { SheetType } from './types';

function extractCssText(rule: CSSStyleSheet | CSSRule): string {
  let css = rule.cssText;

  if ('cssRules' in rule) {
    const inst = (rule as unknown) as CSSGroupingRule;

    for (let i = 0; i < inst.cssRules.length; i += 1) {
      css += extractCssText(inst.cssRules[i]);
    }
  }

  return css;
}

export default function getInsertedStyles(type: SheetType): string {
  return extractCssText(getDocumentStyleSheet(type));
}
