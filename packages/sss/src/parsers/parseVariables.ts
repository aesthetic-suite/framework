import { Variables } from '@aesthetic/types';
import { hyphenate, objectLoop } from '@aesthetic/utils';
import validateDeclarations from '../helpers/validateDeclarations';
import Block from '../Block';
import { ParserOptions } from '../types';

export default function parseVariables<T extends object>(
  parent: Block<T> | null,
  variables: Variables,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    validateDeclarations(variables, '@variables');
  }

  const object: Variables = {};

  objectLoop(variables, (value, prop) => {
    let name = hyphenate(prop);

    if (name.slice(0, 2) !== '--') {
      name = `--${name}`;
    }

    if (parent) {
      parent.addVariable(name, value);
      options.onVariable?.(parent, name, value);
    } else {
      object[name] = value;
    }
  });

  if (!parent) {
    options.onRootVariables?.(object);
  }
}
