import { objectReduce } from '@aesthetic/utils';
import formatDeclaration from './formatDeclaration';
import { GenericProperties } from '../types';

/**
 * Format an object of property value pairs into a CSS declartion block,
 * without wrapping brackets.
 */
export default function formatDeclarationBlock(properties: GenericProperties): string {
  return objectReduce(properties, (value, key) => formatDeclaration(key, value)).trim();
}
