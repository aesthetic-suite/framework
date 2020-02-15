import getDocumentStyleSheet from './getDocumentStyleSheet';
import { SheetType } from './types';

export default function getInsertedStyles(type: SheetType): string {
  const sheet = getDocumentStyleSheet(type);
  let css = '';

  for (let i = 0; i < sheet.cssRules.length; i += 1) {
    css += sheet.cssRules[i].cssText;
  }

  return css;
}
