import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import createQueue from '../helpers/createQueue';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import validateDeclarations from '../helpers/validateDeclarations';
import { LocalBlock, ParserOptions } from '../types';
import parseBlock from './parseBlock';
import parseConditionalBlock from './parseConditionalBlock';
import parseFallbacks from './parseFallbacks';
import parseSelector from './parseSelector';
import parseVariables from './parseVariables';
import parseVariants from './parseVariants';

export default function parseLocalBlock<T extends object>(
  parent: Block<T>,
  object: LocalBlock,
  options: ParserOptions<T>,
): Block<T> {
  if (__DEV__) {
    validateDeclarationBlock(object, parent.id);
  }

  const props = { ...object };
  const queue = createQueue(options);

  queue.add(props, '@fallbacks', (data) => parseFallbacks(parent, data, options));
  queue.add(props, '@variables', (data) => parseVariables(parent, data, options));
  queue.add(props, '@variants', (data) => parseVariants(parent, data, options));

  // Standard properties must be parsed before all at-rules
  const block = parseBlock(parent, props, options);

  queue.process();

  return block;
}
