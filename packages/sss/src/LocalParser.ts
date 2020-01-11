import Parser from './Parser';
import { LocalStyleSheet } from './types';

export default class LocalParser<T extends object> extends Parser<T> {
  parse(styleSheet: LocalStyleSheet) {}
}
