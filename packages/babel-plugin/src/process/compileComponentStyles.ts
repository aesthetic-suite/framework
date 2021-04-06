import { NodePath, types as t } from '@babel/core';
import { convertCompiledResultSheetToAST } from '../ast/convertCompiledResultSheetToAST';
import { State } from '../types';
import { compileStyleSheet } from './compileStyleSheet';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function compileComponentStyles(
  state: State,
  factoryName: string,
  varPath: NodePath<t.VariableDeclarator>,
): [string, t.ObjectExpression] {
  const varName = (varPath.node.id as t.Identifier).name;

  const resultSheet = compileStyleSheet(
    state,
    evaluateAestheticStyleFactory(state, factoryName, varPath.node.init as t.CallExpression),
  );

  // eslint-disable-next-line no-param-reassign
  state.file.metadata.aesthetic = { renderResult: resultSheet };

  return [varName, convertCompiledResultSheetToAST(resultSheet)];
}
