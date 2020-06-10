import { CSS, GenericProperties, Variables } from '@aesthetic/types';
import formatDeclarationBlock from './formatDeclarationBlock';

/**
 * Format a property value pair into a full CSS rule with brackets and optional selector.
 * Does not include the class name so that a unique hash can be generated.
 */
export default function formatRule(
  selector: string | undefined,
  properties: GenericProperties,
  variables?: Variables,
): CSS {
  return `${selector || ''} { ${formatDeclarationBlock(properties, variables)} }`;
}
