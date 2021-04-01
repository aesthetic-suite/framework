import { NodePath, types as t } from '@babel/core';
import { State } from '../types';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function compileComponentStyles(
  state: State,
  factoryName: string,
  varPath: NodePath<t.VariableDeclarator>,
): [string, t.ObjectExpression] {
  const varName = (varPath.node.id as t.Identifier).name;

  // Render with Aesthetic
  const resultSheet = state.aesthetic.renderComponentStyles(
    evaluateAestheticStyleFactory(state, factoryName, varPath.node.init as t.CallExpression),
  );

  // eslint-disable-next-line no-param-reassign
  state.file.metadata.aesthetic = { renderResult: resultSheet };

  // Convert rendered result to AST
  const cache = t.objectExpression([]);

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

      Object.entries(result.variants).forEach(([type, variant]) => {
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

    cache.properties.push(t.objectProperty(t.identifier(selector), value));
  });

  return [varName, cache];
}
