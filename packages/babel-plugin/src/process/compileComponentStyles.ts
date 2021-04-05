import intersection from 'lodash/intersection';
import { CompiledRenderResultSheet, LocalSheet, RenderResultSheet } from '@aesthetic/core';
import { NodePath, types as t } from '@babel/core';
import { convertCompiledResultSheetToAST } from '../ast/convertCompiledResultSheetToAST';
import { State } from '../types';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function compileComponentStyles(
  state: State,
  factoryName: string,
  varPath: NodePath<t.VariableDeclarator>,
): [string, t.ObjectExpression] {
  const { aesthetic } = state;
  const varName = (varPath.node.id as t.Identifier).name;
  const styleSheet: LocalSheet<unknown, {}, unknown> = evaluateAestheticStyleFactory(
    state,
    factoryName,
    varPath.node.init as t.CallExpression,
  );

  // Render the stylesheet with every theme
  const themeResultSheets: Record<string, RenderResultSheet<unknown>> = {};

  // @ts-expect-error Allow access
  Object.keys(aesthetic.themeRegistry.themes).forEach((themeName) => {
    themeResultSheets[themeName] = aesthetic.renderComponentStyles(styleSheet, themeName);
  });

  const themeCount = Object.keys(themeResultSheets).length;

  // Create a result that is shared amongst all themes
  const sharedResultSheet: CompiledRenderResultSheet = {};

  Object.values(themeResultSheets).forEach((resultSheet) => {
    Object.entries(resultSheet).forEach(([selector, result]) => {
      if (!result) {
        return;
      }

      let sharedResult = sharedResultSheet[selector];

      if (!sharedResult) {
        sharedResult = {};
        sharedResultSheet[selector] = sharedResult;
      }

      if (result.variants) {
        if (!sharedResult.variants) {
          sharedResult.variants = {};
        }

        Object.assign(sharedResult.variants, result.variants);
      }

      if (result.variantTypes) {
        if (sharedResult.variantTypes) {
          sharedResult.variantTypes = new Set([
            ...Array.from(sharedResult.variantTypes),
            ...Array.from(result.variantTypes),
          ]);
        } else {
          sharedResult.variantTypes = result.variantTypes;
        }
      }
    });
  });

  // Determine the intersection of theme results so that we can optimize
  if (themeCount > 1) {
    Object.keys(sharedResultSheet).forEach((selector) => {
      const sharedResult = sharedResultSheet[selector];
      const themeClassNames = Object.values(themeResultSheets)
        .map((resultSheet) => resultSheet[selector]?.result)
        .filter(Boolean)
        .map((result) => String(result).split(' '));
      const intersectedClassNames = intersection(...themeClassNames);

      sharedResult.result = intersectedClassNames.join(' ');

      // Add theme results that are unique and not part of the intersection
      Object.entries(themeResultSheets).forEach(([themeName, resultSheet]) => {
        let className = resultSheet[selector]?.result;

        if (className) {
          intersectedClassNames.forEach((classToRemove) => {
            className = String(className).replace(classToRemove, '').trim();
          });

          if (!sharedResult.themes) {
            sharedResult.themes = {};
          }

          sharedResult.themes[themeName] = String(className);
        }
      });
    });
  }

  // eslint-disable-next-line no-param-reassign
  state.file.metadata.aesthetic = { renderResult: sharedResultSheet };

  return [varName, convertCompiledResultSheetToAST(sharedResultSheet)];
}
