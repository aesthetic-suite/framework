import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { LocalBlockVariants, ParserOptions } from '../types';
import parseLocalBlock from './parseLocalBlock';

export default function parseVariants<T extends object>(
  parent: Block<T>,
  variants: LocalBlockVariants,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    validateDeclarations(variants, '@variants');
  }

  objectLoop(variants, (variant, parentType) => {
    objectLoop(variant, (object, childType) => {
      const type = `${parentType}_${childType}`;

      const variantBlock = new Block();
      parent.variants[type] = variantBlock;

      const block = parseLocalBlock(variantBlock, object, options);

      options.onVariant?.(parent, type, block, { specificity: 0 });
    });
  });
}
