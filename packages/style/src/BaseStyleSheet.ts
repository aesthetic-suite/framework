import getDocumentStyleSheet from './getDocumentStyleSheet';
import { SheetType } from './types';

export default abstract class BaseStyleSheet {
  sheet: CSSStyleSheet;

  constructor(type: SheetType) {
    this.sheet = getDocumentStyleSheet(type);
  }

  abstract insertRule(...params: unknown[]): number;
}
