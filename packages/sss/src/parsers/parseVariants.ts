import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { LocalBlockMap, ParserOptions } from '../types';
import parseLocalBlock from './parseLocalBlock';

export default function parseVariants<T extends object>(
  parent: Block<T>,
  variants: LocalBlockMap,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    validateDeclarations(variants, '@variants');
  }

  objectLoop(variants, (object, variant) => {
    const variantBlock = new Block();
    parent.variants[variant] = variantBlock;

    const block = parseLocalBlock(variantBlock, object, options);

    options.onVariant?.(parent, variant, block, { specificity: 0 });
  });
}
