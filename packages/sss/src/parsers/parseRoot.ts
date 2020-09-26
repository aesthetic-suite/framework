import Block from '../Block';
import { LocalBlock, ParserOptions } from '../types';
import parseLocalBlock from './parseLocalBlock';

export default function parseRoot<T extends object>(
  globals: LocalBlock,
  options: ParserOptions<T>,
) {
  const block = parseLocalBlock(new Block('@root'), globals, options);

  options.onRoot?.(block);
}
