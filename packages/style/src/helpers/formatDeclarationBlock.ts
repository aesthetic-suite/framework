import { objectReduce } from '@aesthetic/utils';
import formatDeclaration from './formatDeclaration';
import { ProcessedProperties } from '../types';

/**
 * Format an object of property value pairs into a CSS declartion block,
 * without wrapping brackets.
 */
export default function formatDeclarationBlock(properties: ProcessedProperties): string {
  return objectReduce(properties, (value, key) => formatDeclaration(String(key), value)).trim();
}
