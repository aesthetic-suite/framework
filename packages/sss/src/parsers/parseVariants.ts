import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { LocalBlockMap, ParserOptions } from '../types';
import parseLocalBlock from './parseLocalBlock';

const VARIANT_PATTERN = /([a-z][a-z0-9]*:[a-z0-9_-]+)/iu;
const COMBO_PATTERN = new RegExp(
  `^${VARIANT_PATTERN.source}( \\+ ${VARIANT_PATTERN.source})*$`,
  'iu',
);

export default function parseVariants<T extends object>(
  parent: Block<T>,
  variants: LocalBlockMap,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    validateDeclarations(variants, '@variants');
  }

  objectLoop(variants, (object, variant) => {
    if (__DEV__) {
      if (!COMBO_PATTERN.test(variant)) {
        throw new Error(
          `Invalid variant "${variant}". Type and enumeration must be separated with a ":", and each part may only contain a-z, 0-9, -, _.`,
        );
      }
    }

    const variantBlock = new Block();
    parent.variants[variant] = variantBlock;

    const block = parseLocalBlock(variantBlock, object, options);
    const list = variant.includes('+') ? variant.split('+').map((v) => v.trim()) : variant;

    options.onVariant?.(parent, list, block, { specificity: 0 });
  });
}
