import { Property } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { Events, Rule } from '../types';
import parseProperty from './parseProperty';
import parseSelector from './parseSelector';

export default function parseBlock<T extends object>(
  parent: Block<T>,
  object: Rule,
  events: Events<T>,
): Block<T> {
  if (__DEV__) {
    validateDeclarationBlock(object, parent.selector);
  }

  objectLoop(object, (value, key) => {
    if (value === undefined) {
      return;
    }

    const char = key.charAt(0);

    // Pseudo and attribute selectors
    if (char === ':' || char === '[') {
      parseSelector(parent, key, value as Rule, false, events);

      // Special case for unique at-rules (@page blocks)
    } else if (char === '@') {
      parent.addNested(parseBlock(new Block(key), value as Rule, events));

      // Run for each property so it can be customized
    } else {
      parseProperty(parent, key as Property, value, events);
    }
  });

  events.onBlock?.(parent);

  return parent;
}
