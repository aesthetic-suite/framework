import { CSS, GenericProperties, Variables } from '@aesthetic/types';
import { objectReduce } from '@aesthetic/utils';
import formatDeclaration from './formatDeclaration';
import formatVariable from './formatVariable';

/**
 * Format an object of property value pairs, and optional CSS variable pairs,
 * into a CSS declaration block, without wrapping brackets.
 */
export default function formatDeclarationBlock(
  properties: GenericProperties,
  variables?: Variables,
): CSS {
  let css = '';

  if (variables) {
    css += objectReduce(variables, (value, key) => formatVariable(key, value));
  }

  css += objectReduce(properties, (value, key) => formatDeclaration(key, value));

  return css;
}
