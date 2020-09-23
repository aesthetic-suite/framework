import { arrayLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { NestedListener, Events, Rule } from '../types';
import parseLocalBlock from './parseLocalBlock';

function isSelector(value: string): boolean {
  return value[0] === ':' || value[0] === '[';
}

export default function parseSelector<T extends object>(
  parent: Block<T>,
  selector: string,
  object: Rule,
  inAtRule: boolean,
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarationBlock(object, selector);

    if ((selector.includes(',') || !isSelector(selector)) && !inAtRule) {
      throw new Error(`Advanced selector "${selector}" must be nested within a @selectors block.`);
    }
  }

  arrayLoop(selector.split(','), (k) => {
    let name = k.trim();
    let specificity = 0;

    // Capture specificity
    while (name[0] === '&') {
      specificity += 1;
      name = name.slice(1);
    }

    const block = parseLocalBlock(parent.addNested(new Block(name)), object, events);
    const args: Parameters<NestedListener<T>> = [parent, name, block, { specificity }];

    if (name[0] === ':') {
      events.onPseudo?.(...args);
    } else if (name[0] === '[') {
      events.onAttribute?.(...args);
    } else {
      events.onSelector?.(...args);
    }
  });
}
