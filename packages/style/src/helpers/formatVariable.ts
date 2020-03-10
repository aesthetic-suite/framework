import formatVariableName from './formatVariableName';
import { Value } from '../types';

/**
 * Format a CSS variable pair.
 */
export default function formatVariable(property: string, value: Value): string {
  return `${formatVariableName(property)}:${value};`;
}
