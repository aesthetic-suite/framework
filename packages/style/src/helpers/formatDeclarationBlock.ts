import applyUnitToValue from './applyUnitToValue';
import formatDeclaration from './formatDeclaration';
import { Properties, Property } from '../types';

/**
 * Format an object of property value pairs into a CSS declartion block,
 * without wrapping brackets.
 */
export default function formatDeclarationBlock(properties: Properties): string {
  const props = Object.keys(properties);
  let block = '';

  for (let i = 0; i < props.length; i += 1) {
    const prop = props[i] as Property;

    block += formatDeclaration(prop, applyUnitToValue(prop, properties[prop]!));
    block += '; ';
  }

  return block.trim();
}
