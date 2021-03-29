/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */

import Module from 'module';
import { LocalStyleSheet } from '@aesthetic/core';
import { generateHash } from '@aesthetic/utils';
import { types as t } from '@babel/core';
import generate from '@babel/generator';
import { State } from '../types';

export function evaluateComponentStyles(
  state: State,
  factoryName: string,
  styleSheetNode: t.CallExpression,
): LocalStyleSheet {
  console.log('evaluateComponentStyles');

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

  console.log(code);

  // Evaluate the code in the current module scope
  const id = state.filePath
    .parent()
    .append(`${generateHash(code)}.js`)
    .path();

  const mod = new Module(id, module);
  mod.filename = id;
  // @ts-expect-error Not typed
  mod.paths = Module._nodeModulePaths(mod.path);

  console.log(mod, global.AESTHETIC_CUSTOM_ENGINE);
  mod.exports = { AESTHETIC_CUSTOM_ENGINE: global.AESTHETIC_CUSTOM_ENGINE };
  mod._compile(code, id);

  return mod.exports;
}
