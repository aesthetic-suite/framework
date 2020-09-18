import { Variables } from '@aesthetic/types';
import { hyphenate, objectLoop } from '@aesthetic/utils';
import validateDeclarations from '../helpers/validateDeclarations';
import Block from '../Block';
import { Events } from '../types';

export default function parseVariables<T extends object>(
  parent: Block<T> | null,
  variables: Variables,
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarations(variables, '@variables');
  }

  objectLoop(variables, (value, prop) => {
    let name = hyphenate(prop);

    if (name.slice(0, 2) !== '--') {
      name = `--${name}`;
    }

    if (parent) {
      parent.addVariable(name, value);
      events.onVariable?.(parent, name, value);
    } else {
      events.onRootVariable?.(name, value);
    }
  });
}
