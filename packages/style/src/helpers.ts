/* eslint-disable no-magic-numbers */

import { hyphenate } from '@aesthetic/utils';

export function isAtRule(value: string): boolean {
  return value[0] === '@';
}

export function isImportRule(value: string): boolean {
  return value.slice(0, 7) === '@import' && value[7] === ' ';
}

export function isNestedSelector(value: string): boolean {
  const char = value[0];

  return (
    char === ':' ||
    char === '[' ||
    char === '>' ||
    char === '~' ||
    char === '+' ||
    char === '*' ||
    char === '|'
  );
}

const unitlessProperties = new Set<string>();

[
  'animationIterationCount',
  'borderImage',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'fontWeight',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'lineClamp',
  'lineHeight',
  'maskBorder',
  'maskBorderOutset',
  'maskBorderSlice',
  'maskBorderWidth',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  // SVG
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
].forEach((property) => {
  unitlessProperties.add(property);
  unitlessProperties.add(hyphenate(property));
});

export function isUnitlessProperty(property: string): boolean {
  return unitlessProperties.has(property);
}

export function isVariable(value: string): boolean {
  return value.slice(0, 2) === '--';
}
