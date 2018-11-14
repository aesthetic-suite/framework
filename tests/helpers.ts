import { StyleSheetTestUtils } from 'aphrodite';
import { renderToString } from 'fela-tools';

export function cleanStyles(source) {
  return source.replace(/\n/g, '').replace(/\s{2,}/g, '');
}

export function renderAphroditeStyles() {
  return cleanStyles(StyleSheetTestUtils.getBufferedStyles().join(''));
}

export function renderFelaStyles(instance) {
  return cleanStyles(renderToString(instance.fela));
}

export function renderJSSStyles(instance) {
  return cleanStyles(instance.sheet.toString());
}

export function renderTSStyles(instance) {
  return cleanStyles(instance.typeStyle.getStyles());
}
