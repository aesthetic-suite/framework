import Module from 'module';
import { LocalStyleSheet } from '@aesthetic/core';
import { types as t } from '@babel/core';
import generate from '@babel/generator';
import { State } from '../types';

export function evaluateComponentStyles(
  state: State,
  factoryName: string,
  styleSheetNode: t.CallExpression,
): LocalStyleSheet {
  // Node `require()` instead of import
  const requireNode = t.variableDeclaration('const', [
    t.variableDeclarator(
      t.objectPattern([
        t.objectProperty(t.identifier('createComponentStyles'), t.identifier(factoryName)),
      ]),
      t.callExpression(t.identifier('require'), [t.stringLiteral(state.integrationModule)]),
    ),
  ]);

  // Node `module.exports` instead of export
  const moduleExports = t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(t.identifier('module'), t.identifier('exports')),
      styleSheetNode,
    ),
  );

  // Convert the AST into code
  const { code } = generate(t.program([requireNode, moduleExports], []));

  // Evaluate the code in the current module scope
  const id = '';
  const module = new Module(id);

  // eslint-disable-next-line no-underscore-dangle
  module._compile(code, id);

  return module.exports;
}
