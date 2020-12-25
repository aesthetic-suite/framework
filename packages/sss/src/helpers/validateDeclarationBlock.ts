import { isObject } from '@aesthetic/utils';

export default function validateDeclarationBlock(block: unknown, name: string): block is object {
  if (__DEV__) {
    if (!isObject(block)) {
      throw new TypeError(`"${name}" must be a declaration object of CSS properties.`);
    }
  }

  return true;
}
