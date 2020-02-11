import { SheetType } from './types';

export default function getDocumentStyleSheet(type: SheetType): CSSStyleSheet {
  const id = `aesthetic-${type}`;
  let element = document.getElementById(id);

  if (!element) {
    const style = document.createElement('style');
    style.setAttribute('id', id);
    style.setAttribute('media', 'screen');

    document.head.append(style);
    element = style;
  }

  return (element as HTMLStyleElement).sheet as CSSStyleSheet;
}
