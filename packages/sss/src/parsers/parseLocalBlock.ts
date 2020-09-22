import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import createQueue from '../helpers/createQueue';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import validateDeclarations from '../helpers/validateDeclarations';
import { Events, LocalBlock } from '../types';
import parseBlock from './parseBlock';
import parseConditionalBlock from './parseConditionalBlock';
import parseFallbacks from './parseFallbacks';
import parseSelector from './parseSelector';
import parseVariables from './parseVariables';
import parseVariants from './parseVariants';

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

  queue.add(props, '@fallbacks', (data) => parseFallbacks(parent, data, events));
  queue.add(props, '@media', (data) => parseConditionalBlock(parent, data, 'media', events));
  queue.add(props, '@selectors', (data) => {
    if (__DEV__) {
      validateDeclarations(data, '@selectors');
    }

    objectLoop(data, (value, key) => {
      parseSelector(parent, key, value, true, events);
    });
  });
  queue.add(props, '@supports', (data) => parseConditionalBlock(parent, data, 'supports', events));
  queue.add(props, '@variables', (data) => parseVariables(parent, data, events));
  queue.add(props, '@variants', (data) => parseVariants(parent, data, events));

  // Standard properties must be parsed before all at-rules
  const block = parseBlock(parent, props, events);

  queue.process();

  return block;
}
