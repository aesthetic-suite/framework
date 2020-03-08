import { objectReduce } from '@aesthetic/utils';
import formatDeclaration from './formatDeclaration';
import { GenericProperties, CSSVariables } from '../types';
import formatCssVariable from './formatCssVariable';

/**
 * Format an object of property value pairs, and optional CSS variable pairs,
 * into a CSS declaration block, without wrapping brackets.
 */
export default function formatDeclarationBlock(
  properties: GenericProperties,
  variables?: CSSVariables,
): string {
  let css = '';

  if (variables) {
    css += objectReduce(variables, (value, key) => formatCssVariable(key, value)).trim();
  }

  css += objectReduce(properties, (value, key) => formatDeclaration(key, value)).trim();

  return css;
}
