import { hyphenate } from '@aesthetic/utils';

export default function formatCssVariableName(name: string): string {
  let varName = hyphenate(name);

  if (varName.slice(0, 2) !== '--') {
    varName = `--${varName}`;
  }

  return varName;
}
