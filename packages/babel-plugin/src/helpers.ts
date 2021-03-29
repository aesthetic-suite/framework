import { types as t } from '@babel/core';

export function isFunction(node: t.Node) {
  return t.isFunctionExpression(node) || t.isArrowFunctionExpression(node);
}
