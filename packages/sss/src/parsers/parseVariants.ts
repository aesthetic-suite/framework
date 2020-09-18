import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarations from '../helpers/validateDeclarations';
import { Events, LocalBlockVariants } from '../types';
import parseLocalBlock from './parseLocalBlock';

export default function parseVariants<T extends object>(
  parent: Block<T>,
  variants: LocalBlockVariants,
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarations(variants, '@variants');
  }

  objectLoop(variants, (variant, parentType) => {
    objectLoop(variant, (object, subType) => {
      const type = `${parentType}_${subType}`;
      const block = parseLocalBlock(new Block(type), object, events);

      parent.addVariant(block);
      events.onVariant?.(parent, type, block, { specificity: 0 });
    });
  });
}
