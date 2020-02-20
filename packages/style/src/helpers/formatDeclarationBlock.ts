import { objectReduce } from '@aesthetic/utils';
import applyUnitToValue from './applyUnitToValue';
import formatDeclaration from './formatDeclaration';
import { Properties } from '../types';

/**
 * Format an object of property value pairs into a CSS declartion block,
 * without wrapping brackets.
 */
export default function formatDeclarationBlock(properties: Properties): string {
  return objectReduce(
    properties,
    (value, key) => `${formatDeclaration(key, applyUnitToValue(key, value!))}; `,
  ).trim();
}
