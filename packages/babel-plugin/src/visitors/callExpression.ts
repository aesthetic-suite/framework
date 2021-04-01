import { NodePath, types as t } from '@babel/core';
import { isFunction } from '../helpers';
import { compileComponentStyles } from '../process/compileComponentStyles';
import { RenderRuntimeCallback, State } from '../types';

// Find the parent variable declarator so that we include any chained methods
function findParentVariable(path: NodePath<t.CallExpression>, localName: string) {
  const parent = path.findParent((p) => t.isVariableDeclarator(p));

  if (!parent) {
    throw new Error(`"${localName}" must be assigned to a variable.`);
  }

  return parent as NodePath<t.VariableDeclarator>;
}

export default function callExpression(
  path: NodePath<t.CallExpression>,
  state: State,
  insertRenderRuntime: RenderRuntimeCallback,
) {
  const { node } = path;
  const { styleFactories } = state;

  if (!t.isIdentifier(node.callee) || !(node.callee.name in styleFactories)) {
    return;
  }

  const localName = node.callee.name;
  const originalName = styleFactories[localName];
  let varName = '';
  let renderResult: t.ObjectExpression | null = null;

  switch (originalName) {
    case 'createComponentStyles': {
      if (node.arguments.length !== 1 || !isFunction(node.arguments[0])) {
        throw new Error(`Expected a factory function for ${localName} in ${state.filename}.`);
      }

      [varName, renderResult] = compileComponentStyles(
        state,
        localName,
        findParentVariable(path, localName),
      );
      break;
    }

    default:
      throw new Error(`Unknown style factory "${localName}".`);
  }

  if (!renderResult) {
    return;
  }

  // Insert the render runtime with the cached result
  insertRenderRuntime(
    path.findParent((p) => t.isVariableDeclaration(p)) as NodePath<t.VariableDeclaration>,
    varName,
    renderResult,
  );
}
