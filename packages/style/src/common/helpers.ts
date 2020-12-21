/* eslint-disable no-magic-numbers */

import { Value, MaybeValue, CSS, Sheet } from '@aesthetic/types';
import { hyphenate } from '@aesthetic/utils';
import { IMPORT_RULE, STYLE_RULE } from './constants';

export function insertRule(sheet: Sheet, rule: CSS, index?: number): number {
  try {
    return sheet.insertRule(rule, index ?? sheet.cssRules.length);
  } catch {
    // Vendor prefixed properties, pseudos, etc, that are inserted
    // into different vendors will trigger a failure. For example,
    // `-moz` or `-ms` being inserted into WebKit.
    // There's no easy way around this, so let's just ignore the
    // error so that subsequent styles are inserted.
    // istanbul ignore next
    return -1;
  }
}

export function insertAtRule(sheet: Sheet, rule: CSS): number {
  const { length } = sheet.cssRules;
  let index = 0;

  // At-rules must be inserted before normal style rules.
  for (let i = 0; i <= length; i += 1) {
    index = i;

    if (sheet.cssRules[i]?.type === STYLE_RULE) {
      break;
    }
  }

  return insertRule(sheet, rule, index);
}

export function insertImportRule(sheet: Sheet, rule: CSS): number {
  const { length } = sheet.cssRules;
  let index = 0;

  // Import rules must be inserted at the top of the style sheet,
  // but we also want to persist the existing order.
  for (let i = 0; i <= length; i += 1) {
    index = i;

    if (sheet.cssRules[i]?.type !== IMPORT_RULE) {
      break;
    }
  }

  return insertRule(sheet, rule, index);
}

export function isAtRule(value: string): boolean {
  return value[0] === '@';
}

export function isImportRule(value: string): boolean {
  return value.slice(0, 7) === '@import';
}

export function isMediaRule(value: string): boolean {
  return value.slice(0, 6) === '@media';
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

export function isSupportsRule(value: string): boolean {
  return value.slice(0, 9) === '@supports';
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

export function isValidValue(property: string, value: MaybeValue | boolean): value is Value {
  if (value === null || value === undefined || value === true || value === false || value === '') {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid value "${value}" for "${property}".`);
    }

    return false;
  }

  return true;
}

export function isVariable(value: string): boolean {
  return value.slice(0, 2) === '--';
}

export function joinQueries(prev: string | undefined, next: string): string {
  if (prev) {
    return `${prev} and ${next}`;
  }

  return next;
}
