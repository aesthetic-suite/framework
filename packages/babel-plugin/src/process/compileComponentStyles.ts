import { NodePath, types as t } from '@babel/core';
import { State } from '../types';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function compileComponentStyles(
  state: State,
  factoryName: string,
  factoryPath: NodePath<t.CallExpression>,
) {
  // Render with Aesthetic
  const resultSheet = state.aesthetic.renderComponentStyles(
    evaluateAestheticStyleFactory(state, factoryName, factoryPath.node),
  );

  // eslint-disable-next-line no-param-reassign
  state.file.aesthetic = { renderResult: resultSheet };

  // Convert rendered result to AST
  const ast = t.objectExpression([]);

  Object.entries(resultSheet).forEach(([selector, result]) => {
    if (!result) {
      return;
    }

    const value = t.objectExpression([]);

    // Class name
    if (result.result) {
      value.properties.push(
        t.objectProperty(t.identifier('result'), t.stringLiteral(String(result.result))),
      );
    }

    // Variant class names
    if (result.variants) {
      const variants = t.objectExpression([]);

      Object.entries(variants).forEach(([type, variant]) => {
        variants.properties.push(
          t.objectProperty(t.identifier(type), t.stringLiteral(String(variant))),
        );
      });

      value.properties.push(t.objectProperty(t.identifier('variants'), variants));
    }

    // Variant types
    if (result.variantTypes) {
      const types = t.newExpression(t.identifier('Set'), [
        t.arrayExpression(Array.from(result.variantTypes).map((type) => t.stringLiteral(type))),
      ]);

      value.properties.push(t.objectProperty(t.identifier('variantTypes'), types));
    }

    ast.properties.push(t.objectProperty(t.identifier(selector), value));
  });

  // Inject result into the `createComponentStyles` call
  if (t.isIdentifier(factoryPath.node.callee, { name: factoryName })) {
    factoryPath.node.arguments.push(ast);
  } else {
    factoryPath.traverse({
      CallExpression({ node }) {
        if (t.isIdentifier(node.callee, { name: factoryName })) {
          node.arguments.push(ast);
        }
      },
    });
  }
}
