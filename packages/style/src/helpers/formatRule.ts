import formatDeclarationBlock from './formatDeclarationBlock';
import { ProcessedProperties } from '../types';

/**
 * Format a property value pair into a full CSS rule with brackets and optional selector.
 * Does not include the class name so that a unique hash can be generated.
 */
export default function formatRule(properties: ProcessedProperties, selector: string = ''): string {
  return `${selector} { ${formatDeclarationBlock(properties)} }`;
}
