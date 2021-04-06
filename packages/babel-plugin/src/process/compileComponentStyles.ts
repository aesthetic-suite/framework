import { NodePath, types as t } from '@babel/core';
import { convertResultInputSheetToAST } from '../ast/convertResultInputSheet';
import { State } from '../types';
import { compileStyleSheet } from './compileStyleSheet';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function compileComponentStyles(
  state: State,
  factoryName: string,
  varPath: NodePath<t.VariableDeclarator>,
): [string, t.ObjectExpression] {
  const resultSheet = compileStyleSheet(
    state,
    evaluateAestheticStyleFactory(state, factoryName, varPath.node.init as t.CallExpression),
  );

  // eslint-disable-next-line no-param-reassign
  state.file.metadata.aesthetic = { renderResult: resultSheet };

  return [(varPath.node.id as t.Identifier).name, convertResultInputSheetToAST(resultSheet)];
}
