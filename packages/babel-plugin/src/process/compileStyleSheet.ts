import intersection from 'lodash/intersection';
import {
  ClassName,
  CompiledRenderResult,
  CompiledRenderResultSheet,
  RenderResultSheet,
} from '@aesthetic/core';
import { State, UnknownLocalSheet } from '../types';

function removeClassesFromClassName(name: string, names: string[]): string {
  let className = name;

  names.forEach((classToRemove) => {
    className = className.replace(classToRemove, '').trim();
  });

  return className;
}

function renderAndCombineResultSheets(
  aesthetic: State['aesthetic'],
  styleSheet: UnknownLocalSheet,
): CompiledRenderResultSheet {
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
        const className = resultSheet[selector]?.result;

        if (className) {
          if (!sharedResult.themes) {
            sharedResult.themes = {};
          }

          sharedResult.themes[themeName] = removeClassesFromClassName(
            String(className),
            intersectedClassNames,
          );
        }
      });
    });
  }

  return sharedResultSheet;
}

function renderWithOppositeDirection(
  aesthetic: State['aesthetic'],
  styleSheet: UnknownLocalSheet,
): CompiledRenderResultSheet {
  const activeDirection = aesthetic.getActiveDirection();
  const otherDirection = activeDirection === 'ltr' ? 'rtl' : 'ltr';

  // Change to other direction
  aesthetic.changeDirection(otherDirection, false);

  const result = renderAndCombineResultSheets(aesthetic, styleSheet);

  // Be sure to change back for subsequent renders
  aesthetic.changeDirection(activeDirection, false);

  return result;
}

function determineIntersectedDirectionClassNames(
  ltrClass: ClassName | undefined,
  rtlClass: ClassName | undefined,
): ClassName[] {
  if (!ltrClass && !rtlClass) {
    return [];
  }

  if (!ltrClass) {
    return ['', '', rtlClass!];
  }

  if (!rtlClass) {
    return ['', ltrClass];
  }

  const intersectedClasses = intersection(ltrClass.split(' '), rtlClass.split(' '));

  return [
    intersectedClasses.join(' '),
    removeClassesFromClassName(ltrClass, intersectedClasses),
    removeClassesFromClassName(rtlClass, intersectedClasses),
  ];
}

function mergeResults(
  ltrResult: CompiledRenderResult | undefined,
  rtlResult: CompiledRenderResult | undefined,
): CompiledRenderResult {
  const result: CompiledRenderResult = {};

  return result;
}

function mergeResultSheets(
  ltrSheet: CompiledRenderResultSheet,
  rtlSheet: CompiledRenderResultSheet,
): CompiledRenderResultSheet {
  const result: CompiledRenderResultSheet = {};
  const keys = new Set([...Object.keys(ltrSheet), ...Object.keys(rtlSheet)]);

  keys.forEach((key) => {
    result[key] = mergeResults(ltrSheet[key], rtlSheet[key]);
  });

  return result;
}

export function compileStyleSheet(state: State, styleSheet: UnknownLocalSheet) {
  const { aesthetic } = state;
  let resultSheet = renderAndCombineResultSheets(aesthetic, styleSheet);

  // @ts-expect-error Allow access
  if (aesthetic.options.directionConverter) {
    const oppositeResultSheet = renderWithOppositeDirection(aesthetic, styleSheet);

    resultSheet =
      aesthetic.getActiveDirection() === 'rtl'
        ? mergeResultSheets(oppositeResultSheet, resultSheet)
        : mergeResultSheets(resultSheet, oppositeResultSheet);
  }

  return resultSheet;
}
