import { NodePath, types as t } from '@babel/core';
import { isFunction } from '../helpers';
import { compileComponentStyles } from '../process/compileComponentStyles';
import { State } from '../types';

// Find the parent variable declarator so that we include any chained methods
function findParentVariable(path: NodePath<t.CallExpression>, localName: string) {
  const parent = path.findParent((p) => t.isVariableDeclarator(p));

  if (!parent) {
    throw new Error(`"${localName}" must be assigned to a variable.`);
  }

  return parent.node as t.VariableDeclarator;
}

export default function callExpression(path: NodePath<t.CallExpression>, state: State) {
  const { node } = path;
  const { styleFactories } = state;

  if (!t.isIdentifier(node.callee) || !(node.callee.name in styleFactories)) {
    return;
  }

  const localName = node.callee.name;
  const originalName = styleFactories[localName];

  switch (originalName) {
    case 'createComponentStyles': {
      if (node.arguments.length !== 1 || !isFunction(node.arguments[0])) {
        throw new Error(`Expected a factory function for ${localName} in ${state.filename}.`);
      }

      compileComponentStyles(
        state,
        localName,
        findParentVariable(path, localName).init as t.CallExpression,
      );
      break;
    }

    default:
      throw new Error(`Unknown style factory "${localName}".`);
  }
}
