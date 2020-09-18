import { PagePseudos } from './types';

export const COMPOUND_PROPERTIES: Set<string> = new Set(['animationName', 'fontFamily']);

export const EXPANDED_PROPERTIES: Set<string> = new Set([
  'animation',
  'background',
  'border',
  'borderBottom',
  'borderLeft',
  'borderRight',
  'borderTop',
  'columnRule',
  'flex',
  'font',
  'listStyle',
  'margin',
  'offset',
  'outline',
  'padding',
  'textDecoration',
  'transition',
]);

export const PAGE_PSEUDOS: PagePseudos[] = [':blank', ':first', ':left', ':right'];
