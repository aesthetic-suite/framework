import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { Events, LocalBlockMap } from '../types';
import parseLocalBlock from './parseLocalBlock';

export default function parseConditionalBlock<T extends object>(
  parent: Block<T>,
  conditions: LocalBlockMap,
  type: 'media' | 'supports',
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarations(conditions, `@${type}`);
  }

  objectLoop(conditions, (object, condition) => {
    const nestedBlock = parseLocalBlock(new Block(`@${type} ${condition}`), object, events);

    parent.addNested(nestedBlock);

    if (type === 'media') {
      events.onBlockMedia?.(parent, condition, nestedBlock);
    } else {
      events.onBlockSupports?.(parent, condition, nestedBlock);
    }
  });
}
