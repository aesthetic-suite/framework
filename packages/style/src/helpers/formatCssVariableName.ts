import { hyphenateProperty } from 'css-in-js-utils';

export default function formatCssVariableName(name: string): string {
  let varName = hyphenateProperty(name);

  if (varName.slice(0, 2) !== '--') {
    varName = `--${varName}`;
  }

  return varName;
}
