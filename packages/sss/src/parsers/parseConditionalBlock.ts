import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { LocalBlockMap, ParserOptions } from '../types';
import parseLocalBlock from './parseLocalBlock';

export default function parseConditionalBlock<T extends object>(
  parent: Block<T>,
  conditions: LocalBlockMap,
  type: 'media' | 'supports',
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    validateDeclarations(conditions, `@${type}`);
  }

  objectLoop(conditions, (object, condition) => {
    const block = new Block(`@${type} ${condition}`);
    block[type] = condition;

    const nestedBlock = parseLocalBlock(parent.nest(block), object, options);

    if (type === 'media') {
      options.onMedia?.(parent, condition, nestedBlock);
    } else {
      options.onSupports?.(parent, condition, nestedBlock);
    }
  });
}
