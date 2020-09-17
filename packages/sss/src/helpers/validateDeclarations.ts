import { isObject } from '@aesthetic/utils';

export default function validateDeclarations(block: unknown, name: string): block is object {
  if (!isObject(block)) {
    throw new Error(
      `${name} must be a mapping of CSS ${name === '@variables' ? 'variables' : 'declarations'}.`,
    );
  }

  return true;
}
