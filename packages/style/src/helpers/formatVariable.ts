import { CSS, Value } from '@aesthetic/types';
import formatVariableName from './formatVariableName';

/**
 * Format a CSS variable pair.
 */
export default function formatVariable(property: string, value: Value): CSS {
  return `${formatVariableName(property)}:${value};`;
}
