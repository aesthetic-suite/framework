import formatDeclaration from './formatDeclaration';
import { ClassName } from '../types';

/**
 * Format a property value pair into a full CSS rule with brackets and class name.
 * If a selector or at-rule condition is defined, apply them as well.
 */
export default function formatAtomicRule(
  className: ClassName,
  property: string,
  value: string,
  selector?: string,
): string {
  return `.${className}${selector || ''} { ${formatDeclaration(property, value)} }`;
}
