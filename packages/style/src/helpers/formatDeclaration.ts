import { hyphenate, arrayReduce } from '@aesthetic/utils';

/**
 * Format a property value pair into a CSS declaration,
 * without wrapping brackets.
 */
export default function formatDeclaration(property: string, value: string | string[]): string {
  if (Array.isArray(value)) {
    return arrayReduce(value, val => formatDeclaration(property, val));
  }

  return `${hyphenate(property)}:${value};`;
}
