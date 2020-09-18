import { arrayLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { BlockNestedListener, Events, Rule } from '../types';
import parseLocalBlock from './parseLocalBlock';

const SELECTOR = /^((\[[a-z-]+\])|(::?[a-z-]+))$/iu;

export default function parseSelector<T extends object>(
  parent: Block<T>,
  selector: string,
  object: Rule,
  inAtRule: boolean,
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarationBlock(object, selector);

    if ((selector.includes(',') || !selector.match(SELECTOR)) && !inAtRule) {
      throw new Error(`Advanced selector "${selector}" must be nested within a @selectors block.`);
    }
  }

  const block = parseLocalBlock(new Block(selector), object, events);

  arrayLoop(selector.split(','), (k) => {
    let name = k.trim();
    let specificity = 0;

    // Capture specificity
    while (name.charAt(0) === '&') {
      specificity += 1;
      name = name.slice(1);
    }

    const nestedBlock = block.clone(name);
    const args: Parameters<BlockNestedListener<T>> = [parent, name, nestedBlock, { specificity }];

    parent.addNested(nestedBlock);

    if (name.charAt(0) === ':') {
      events.onBlockPseudo?.(...args);
    } else if (name.charAt(0) === '[') {
      events.onBlockAttribute?.(...args);
    } else {
      events.onBlockSelector?.(...args);
    }
  });
}
