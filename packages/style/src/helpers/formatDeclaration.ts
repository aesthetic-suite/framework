import { hyphenate, arrayReduce } from '@aesthetic/utils';
import { Value } from '../types';

/**
 * Format a property value pair into a CSS declaration, without wrapping brackets.
 * If an array of values is provided, format multiple declarations.
 */
export default function formatDeclaration(property: string, value: Value | Value[]): string {
  if (Array.isArray(value)) {
    return arrayReduce(value, val => formatDeclaration(property, val));
  }

  return `${hyphenate(property)}:${value};`;
}
