import { hyphenate } from '@aesthetic/utils';

/**
 * Format a property value pair into a CSS declaration,
 * without wrapping brackets.
 */
export default function formatDeclaration(property: string, value: string): string {
  return `${hyphenate(property)}:${value}`;
}
