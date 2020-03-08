import formatDeclarationBlock from './formatDeclarationBlock';
import { GenericProperties, CSSVariables } from '../types';

/**
 * Format a property value pair into a full CSS rule with brackets and optional selector.
 * Does not include the class name so that a unique hash can be generated.
 */
export default function formatRule(
  selector: string | undefined,
  properties: GenericProperties,
  variables?: CSSVariables,
): string {
  return `${selector || ''} { ${formatDeclarationBlock(properties, variables)} }`;
}
