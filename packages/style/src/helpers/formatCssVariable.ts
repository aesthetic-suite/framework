import formatCssVariableName from './formatCssVariableName';
import { Value } from '../types';

/**
 * Format a CSS variable pair.
 */
export default function formatCssVariable(property: string, value: Value): string {
  return `${formatCssVariableName(property)}:${value};`;
}
