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
  queue.add(styleSheet, '@root', parseRoot);
  queue.add(styleSheet, '@variables', parseRootVariables);
  queue.process();
}
