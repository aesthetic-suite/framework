import Block from '../Block';
import formatFontFace from '../helpers/formatFontFace';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { Events, FontFace, Properties } from '../types';
import parseBlock from './parseBlock';

export default function parseFontFace<T extends object>(
  object: FontFace,
  fontFamily: string,
  events: Events<T>,
): string {
  const name = object.fontFamily || fontFamily || '';

  if (__DEV__) {
    validateDeclarationBlock(object, name);
  }

  const fontFace = formatFontFace({
    ...object,
    fontFamily: name,
  }) as Properties;

  const block = parseBlock(new Block('@font-face'), fontFace, events);

  // Inherit the name from the listener as it may be generated
  return events.onFontFace?.(block, name, object.srcPaths) || name;
}
