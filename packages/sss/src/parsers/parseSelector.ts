import { arrayLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { NestedListener, Events, Rule } from '../types';
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
    while (name[0] === '&') {
      specificity += 1;
      name = name.slice(1);
    }

    const nestedBlock = block.clone(name);
    const args: Parameters<NestedListener<T>> = [parent, name, nestedBlock, { specificity }];

    parent.addNested(nestedBlock);

    if (name[0] === ':') {
      events.onPseudo?.(...args);
    } else if (name[0] === '[') {
      events.onAttribute?.(...args);
    } else {
      events.onSelector?.(...args);
    }
  });
}
