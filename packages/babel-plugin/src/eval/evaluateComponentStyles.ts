import { LocalSheet } from '@aesthetic/core';
import { types as t } from '@babel/core';
import { State } from '../types';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function evaluateComponentStyles(
  state: State,
  factoryName: string,
  styleSheetNode: t.CallExpression,
): LocalSheet<{}, {}, unknown> {
  return evaluateAestheticStyleFactory(state, factoryName, styleSheetNode);
}
