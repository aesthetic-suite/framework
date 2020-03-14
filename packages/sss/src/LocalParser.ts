import { isObject, objectLoop } from '@aesthetic/utils';
import Parser, { CommonEvents } from './Parser';
import Block from './Block';
import { LocalStyleSheet, ClassNameListener, RulesetListener, ParserOptions } from './types';

export const CLASS_NAME = /^[a-z]{1}[a-z0-9-_]+$/iu;

export interface LocalEvents<T extends object> extends CommonEvents<T> {
  onClass?: ClassNameListener;
  onRuleset?: RulesetListener<T>;
}

export default class LocalParser<T extends object> extends Parser<T, LocalEvents<T>> {
  parse(styleSheet: LocalStyleSheet, options: ParserOptions = {}) {
    Object.assign(this.options, options);

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
        this.emit('class', selector, declaration);

        // Declaration
      } else if (isObject(declaration)) {
        this.emit('ruleset', selector, this.parseLocalBlock(new Block(selector), declaration));

        // Unknown
      } else if (__DEV__) {
        throw new Error(
          `Invalid declaration for "${selector}". Must be an object (style declaration) or string (class name).`,
        );
      }
    });
  }
}
