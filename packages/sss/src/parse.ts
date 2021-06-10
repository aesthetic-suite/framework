import { isObject, objectLoop } from '@aesthetic/utils';
import Block from './Block';
import createQueue from './helpers/createQueue';
import setupDefaultOptions from './helpers/setupDefaultOptions';
import parseFontFaceMap from './parsers/parseFontFaceMap';
import parseImport from './parsers/parseImport';
import parseKeyframesMap from './parsers/parseKeyframesMap';
import parseLocalBlock from './parsers/parseLocalBlock';
import parseRoot from './parsers/parseRoot';
import parseRootVariables from './parsers/parseRootVariables';
import { GlobalStyleSheet, LocalStyleSheet, ParserOptions } from './types';

function parseGlobal<T extends object>(styleSheet: GlobalStyleSheet<T>, options: ParserOptions<T>) {
  const queue = createQueue(options);
  queue.add(styleSheet, '@font-face', parseFontFaceMap);
  queue.add(styleSheet, '@import', parseImport);
  queue.add(styleSheet, '@keyframes', parseKeyframesMap);
  queue.add(styleSheet, '@root', parseRoot);
  queue.add(styleSheet, '@variables', parseRootVariables);
  queue.process();
}

function parseLocal<T extends object>(styleSheet: LocalStyleSheet<T>, options: ParserOptions<T>) {
  objectLoop(styleSheet, (declaration, selector) => {
    // At-rule
    if (selector[0] === '@') {
      if (__DEV__) {
        throw new SyntaxError(
          `At-rules may not be defined at the root of a local block, found "${selector}".`,
        );
      }

      // Class name
    } else if (typeof declaration === 'string' && declaration.match(CLASS_NAME)) {
      options.onClass?.(selector, declaration);

      // Rule
    } else if (isObject(declaration)) {
      const block = parseLocalBlock(new Block(selector), declaration, options);

      options.onRule?.(selector, block);

      // Unknown
    } else if (__DEV__) {
      throw new Error(
        `Invalid declaration for "${selector}". Must be an object (style declaration) or string (class name).`,
      );
    }
  });
}

export default function parse<T extends object>(
  type: 'global' | 'local',
  styleSheet: GlobalStyleSheet<T> | LocalStyleSheet<T>,
  baseOptions: Partial<ParserOptions<T>>,
) {
  const options = setupDefaultOptions(baseOptions);

  if (type === 'local') {
    parseLocal(styleSheet as LocalStyleSheet<T>, options);
  } else {
    parseGlobal(styleSheet as GlobalStyleSheet<T>, options);
  }
}
