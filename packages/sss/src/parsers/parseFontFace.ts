import Block from '../Block';
import formatFontFace from '../helpers/formatFontFace';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { ParserOptions, FontFace, Properties } from '../types';
import parseBlock from './parseBlock';

export default function parseFontFace<T extends object>(
  object: FontFace,
  fontFamily: string,
  options: ParserOptions<T>,
): string {
  const name = object.fontFamily || fontFamily || '';

  if (__DEV__) {
    validateDeclarationBlock(object, name);
  }

  const fontFace = formatFontFace({
    ...object,
    fontFamily: name,
  }) as Properties;

  const block = parseBlock(new Block('@font-face'), fontFace, options, false);

  // Inherit the name from the listener as it may be generated
  return options.onFontFace?.(block, name, object.srcPaths) || name;
}
