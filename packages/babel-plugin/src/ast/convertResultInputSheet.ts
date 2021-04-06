import { CompiledClassMap } from '@aesthetic/core';
import { types as t } from '@babel/core';
import { RenderResultInputSheet } from '../types';

function convertCompiledClassMap(
  map: CompiledClassMap,
): t.ObjectExpression | t.StringLiteral | null {
  const keys = Object.keys(map);

  if (keys.length === 1 && keys[0] === '_') {
    if (!map._) {
      return null;
    }

    return t.stringLiteral(String(map._));
  }

  const object = t.objectExpression([]);

  Object.entries(map).forEach(([themeName, className]) => {
    if (className) {
      const value = Array.isArray(className)
        ? t.arrayExpression(className.map((c) => t.stringLiteral(String(c))))
        : t.stringLiteral(String(className));

      object.properties.push(t.objectProperty(t.identifier(themeName), value));
    }
  });

  if (object.properties.length === 0) {
    return null;
  }

  return object;
}

export function convertResultInputSheetToAST(
  resultSheet: RenderResultInputSheet,
): t.ObjectExpression {
  const object = t.objectExpression([]);

  Object.entries(resultSheet).forEach(([selector, result]) => {
    if (!result) {
      return;
    }

    const value = t.objectExpression([]);

    // Shared class name
    if (result.result) {
      const resultValue = convertCompiledClassMap(result.result);

      if (resultValue) {
        value.properties.push(t.objectProperty(t.identifier('result'), resultValue));
      }
    }

    // Variant class names
    if (result.variants) {
      const variants = t.objectExpression([]);

      Object.entries(result.variants).forEach(([type, variant]) => {
        const variantValue = convertCompiledClassMap(variant);

        if (variantValue) {
          variants.properties.push(t.objectProperty(t.identifier(type), variantValue));
        }
      });

      if (variants.properties.length > 0) {
        value.properties.push(t.objectProperty(t.identifier('variants'), variants));
      }
    }

    // Variant types
    if (result.variantTypes.size > 0) {
      value.properties.push(
        t.objectProperty(
          t.identifier('variantTypes'),
          t.arrayExpression(Array.from(result.variantTypes).map((type) => t.stringLiteral(type))),
        ),
      );
    }

    object.properties.push(t.objectProperty(t.identifier(selector), value));
  });

  return object;
}
