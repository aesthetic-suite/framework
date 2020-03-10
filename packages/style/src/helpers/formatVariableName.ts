import { hyphenate } from '@aesthetic/utils';
import isVariable from './isVariable';

export default function formatCssVariableName(name: string): string {
  let varName = hyphenate(name);

  if (!isVariable(varName)) {
    varName = `--${varName}`;
  }

  return varName;
}
