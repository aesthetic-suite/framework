import { joinQueries, objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { ParserOptions, LocalBlockMap } from '../types';
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

    block[type] = joinQueries(parent[type], condition);

    const nestedBlock = parseLocalBlock(parent.addNested(block), object, options);

    if (type === 'media') {
      options.onMedia?.(parent, condition, nestedBlock);
    } else {
      options.onSupports?.(parent, condition, nestedBlock);
    }
  });
}
