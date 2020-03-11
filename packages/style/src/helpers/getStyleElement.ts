import { SheetType } from '../types';

export default function getStyleElement(type: SheetType): HTMLStyleElement | null {
  return document.getElementById(`aesthetic-${type}`) as HTMLStyleElement;
}
