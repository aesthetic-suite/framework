import { isSSR } from '@aesthetic/utils';
import { SheetType } from '../types';

export default function getDocumentStyleSheet(type: SheetType): CSSStyleSheet {
  // This is a little hacky, but hopefully this never gets interacted with
  // istanbul ignore next
  let element = (isSSR()
    ? { sheet: { cssRules: [], insertRule() {} } }
    : document.getElementById(`aesthetic-${type}`)) as HTMLStyleElement;

  if (!element) {
    const style = document.createElement('style');
    style.setAttribute('id', `aesthetic-${type}`);
    style.setAttribute('type', 'text/css');
    style.setAttribute('media', 'screen');
    style.setAttribute('data-aesthetic-type', type);

    document.head.append(style);
    element = style;
  }

  return (element as HTMLStyleElement).sheet as CSSStyleSheet;
}
