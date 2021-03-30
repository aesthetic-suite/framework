import { renderToStyleMarkup } from '@aesthetic/style/server';
import { NodePath, types as t } from '@babel/core';
import { evaluateComponentStyles } from '../eval/evaluateComponentStyles';
import { isFunction } from '../helpers';
import { State } from '../types';

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

      break;
    }

    default:
      throw new Error(`Unknown style factory "${localName}".`);
  }

  // Find the parent variable declarator so that we include any chained methods
  const parent = path.findParent((p) => t.isVariableDeclarator(p));

  if (!parent) {
    throw new Error(`"${localName}" must be assigned to a variable.`);
  }

  const styleSheet = evaluateComponentStyles(
    state,
    localName,
    (parent.node as t.VariableDeclarator).init as t.CallExpression,
  );

  // Render every theme permutation
  // @ts-expect-error Allow access
  const { themes } = state.aesthetic.themeRegistry;

  Object.keys(themes).forEach((themeName) => {
    state.aesthetic.renderComponentStyles(styleSheet, { theme: themeName });
  });

  console.log(styleSheet.renderCache);
}
