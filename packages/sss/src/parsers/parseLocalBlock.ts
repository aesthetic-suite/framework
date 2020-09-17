import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import validateDeclarations from '../helpers/validateDeclarations';
import { Events, LocalBlock } from '../types';
import parseBlock from './parseBlock';
import parseConditionalBlock from './parseConditionalBlock';
import parseFallbackProperties from './parseFallbackProperties';
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

  if (props['@fallbacks']) {
    parseFallbackProperties(parent, props['@fallbacks'], events);

    delete props['@fallbacks'];
  }

  if (props['@media']) {
    parseConditionalBlock(parent, props['@media'], 'media', events);

    delete props['@media'];
  }

  if (props['@selectors']) {
    if (__DEV__) {
      validateDeclarations(props['@selectors'], '@selectors');
    }

    objectLoop(props['@selectors'], (value, key) => {
      parseSelector(parent, key, value, true, events);
    });

    delete props['@selectors'];
  }

  if (props['@supports']) {
    parseConditionalBlock(parent, props['@supports'], 'supports', events);

    delete props['@supports'];
  }

  if (props['@variables']) {
    parseVariables(parent, props['@variables'], events);

    delete props['@variables'];
  }

  if (props['@variants']) {
    parseVariants(parent, props['@variants'], events);

    delete props['@variants'];
  }

  return parseBlock(parent, props, events);
}
