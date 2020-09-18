import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import createQueue from '../helpers/createQueue';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import validateDeclarations from '../helpers/validateDeclarations';
import { Events, LocalBlock } from '../types';
import parseBlock from './parseBlock';
import parseConditionalBlock from './parseConditionalBlock';
import parseFallbackProperties from './parseFallbackProperties';
import parseSelector from './parseSelector';
import parseVariables from './parseVariables';
import parseVariants from './parseVariants';

function parseSelectors<T extends object>(
  selectors: LocalBlock['@selectors'],
  parent: Block<T>,
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarations(selectors, '@selectors');
  }

  objectLoop(selectors!, (value, key) => {
    parseSelector(parent, key, value, true, events);
  });
}

export default function parseLocalBlock<T extends object>(
  parent: Block<T>,
  object: LocalBlock,
  events: Events<T>,
): Block<T> {
  if (__DEV__) {
    validateDeclarationBlock(object, parent.selector);
  }

  const props = { ...object };
  const queue = createQueue(events);

  queue.add(props, '@fallbacks', parseFallbackProperties);
  queue.add(props, '@media', parseConditionalBlock, ['media']);
  queue.add(props, '@selectors', parseSelectors, [parent]);
  queue.add(props, '@supports', parseConditionalBlock, ['supports']);
  queue.add(props, '@variables', parseVariables);
  queue.add(props, '@variants', parseVariants);

  // Standard properties must be parsed before all at-rules
  const block = parseBlock(parent, props, events);

  queue.process();

  return block;
}
