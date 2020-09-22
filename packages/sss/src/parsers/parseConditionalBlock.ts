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
    const nestedBlock = parseLocalBlock(
      parent.addNested(new Block(`@${type} ${condition}`)),
      object,
      events,
    );

    if (type === 'media') {
      events.onMedia?.(parent, condition, nestedBlock);
    } else {
      events.onSupports?.(parent, condition, nestedBlock);
    }
  });
}
