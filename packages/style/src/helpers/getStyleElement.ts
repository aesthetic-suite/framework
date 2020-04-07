import { isSSR } from '@aesthetic/utils';
import { SheetType } from '../types';

export default function getStyleElement(type: SheetType): HTMLStyleElement | null {
  // This is a little hacky, but hopefully this never gets interacted with
  if (isSSR()) {
    return ({
      insertRule() {},
      sheet: {},
    } as unknown) as HTMLStyleElement;
  }

  return document.getElementById(`aesthetic-${type}`) as HTMLStyleElement;
}
