import { Property } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { ParserOptions, Rule } from '../types';
import parseProperty from './parseProperty';
import parseSelector from './parseSelector';

export default function parseBlock<T extends object>(
  parent: Block<T>,
  object: Rule,
  options: ParserOptions<T>,
): Block<T> {
  if (__DEV__) {
    validateDeclarationBlock(object, parent.selector);
  }

  objectLoop(object, (value, key) => {
    if (value === undefined) {
      return;
    }

    // Pseudo and attribute selectors
    if (key[0] === ':' || key[0] === '[') {
      parseSelector(parent, key, value as Rule, false, options);

      // Run for each property so it can be customized
    } else {
      parseProperty(parent, key as Property, value, options);
    }
  });

  options.onBlock?.(parent);

  return parent;
}
