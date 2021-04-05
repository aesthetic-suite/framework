import { CompiledRenderResultSheet } from '@aesthetic/core';
import { types as t } from '@babel/core';

export function convertCompiledResultSheetToAST(
  resultSheet: CompiledRenderResultSheet,
): t.ObjectExpression {
  const object = t.objectExpression([]);

  Object.entries(resultSheet).forEach(([selector, result]) => {
    if (!result) {
      return;
    }

    const value = t.objectExpression([]);

    // Shared class name
    if (result.result) {
      value.properties.push(
        t.objectProperty(t.identifier('result'), t.stringLiteral(String(result.result))),
      );
    }

    // Theme class names
    if (result.themes) {
      const themes = t.objectExpression([]);

      Object.entries(result.themes).forEach(([themeName, className]) => {
        if (className) {
          themes.properties.push(
            t.objectProperty(t.identifier(themeName), t.stringLiteral(String(className))),
          );
        }
      });

      if (themes.properties.length > 0) {
        value.properties.push(t.objectProperty(t.identifier('themes'), themes));
      }
    }

    // Variant class names
    if (result.variants) {
      const variants = t.objectExpression([]);

      Object.entries(result.variants).forEach(([type, variant]) => {
        if (variant) {
          variants.properties.push(
            t.objectProperty(t.identifier(type), t.stringLiteral(String(variant))),
          );
        }
      });

      if (variants.properties.length > 0) {
        value.properties.push(t.objectProperty(t.identifier('variants'), variants));
      }
    }

    // Variant types
    if (result.variantTypes) {
      const types = t.newExpression(t.identifier('Set'), [
        t.arrayExpression(Array.from(result.variantTypes).map((type) => t.stringLiteral(type))),
      ]);

      value.properties.push(t.objectProperty(t.identifier('variantTypes'), types));
    }

    object.properties.push(t.objectProperty(t.identifier(selector), value));
  });

  return object;
}
