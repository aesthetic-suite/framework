import formatDeclarationBlock from './formatDeclarationBlock';
import { ClassName, ProcessedProperties } from '../types';

/**
 * Format a property value pair into a full CSS rule with brackets and class name.
 * If a selector or at-rule condition is defined, apply them as well.
 */
export default function formatAtomicRule(
  className: ClassName,
  properties: ProcessedProperties,
  selector: string = '',
): string {
  return `.${className}${selector} { ${formatDeclarationBlock(properties)} }`;
}
