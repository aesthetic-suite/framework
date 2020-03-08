import { hyphenate } from '@aesthetic/utils';
import isCssVariable from './isCssVariable';

export default function formatCssVariableName(name: string): string {
  let varName = hyphenate(name);

  if (!isCssVariable(varName)) {
    varName = `--${varName}`;
  }

  return varName;
}
