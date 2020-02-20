import { arrayReduce } from '@aesthetic/utils';
import getDocumentStyleSheet from './getDocumentStyleSheet';
import { SheetType } from '../types';

export default function getInsertedStyles(type: SheetType): string {
  return arrayReduce(getDocumentStyleSheet(type).cssRules, rule => rule.cssText);
}
