import { cssifyDeclaration } from 'css-in-js-utils';

/**
 * Format a property value pair into a CSS declaration,
 * without wrapping brackets.
 */
export default function formatDeclaration(property: string, value: string): string {
  // This hyphenates the property internally:
  // https://github.com/robinweser/css-in-js-utils/blob/master/modules/cssifyDeclaration.js
  return cssifyDeclaration(property, value);
}
