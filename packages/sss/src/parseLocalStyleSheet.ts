import { isObject, objectLoop } from '@aesthetic/utils';
import Block from './Block';
import parseLocalBlock from './parsers/parseLocalBlock';
import { LocalStyleSheet, Events } from './types';

export const CLASS_NAME = /^[a-z]{1}[a-z0-9-_]+$/iu;

export default function parseLocalStyleSheet<T extends object>(
  styleSheet: LocalStyleSheet,
  events: Events<T>,
) {
  objectLoop(styleSheet, (declaration, selector) => {
    // At-rule
    if (selector.charAt(0) === '@') {
      if (__DEV__) {
        throw new SyntaxError(
          `At-rules may not be defined at the root of a local block, found "${selector}".`,
        );
      }

      // Class name
    } else if (typeof declaration === 'string' && declaration.match(CLASS_NAME)) {
      events.onClass?.(selector, declaration);

      // Rule
    } else if (isObject(declaration)) {
      events.onRule?.(selector, parseLocalBlock(new Block(selector), declaration, events));

      // Unknown
    } else if (__DEV__) {
      throw new Error(
        `Invalid declaration for "${selector}". Must be an object (style declaration) or string (class name).`,
      );
    }
  });
}
