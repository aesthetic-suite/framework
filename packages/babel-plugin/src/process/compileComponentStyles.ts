import { LocalSheet } from '@aesthetic/core';
import { types as t } from '@babel/core';
import { State } from '../types';
import { evaluateAestheticStyleFactory } from './evaluateAestheticStyleFactory';

export function compileComponentStyles(
  state: State,
  factoryName: string,
  styleSheetNode: t.CallExpression,
) {
  const styleSheet: LocalSheet<{}, {}, unknown> = evaluateAestheticStyleFactory(
    state,
    factoryName,
    styleSheetNode,
  );

  // Render with Aesthetic
  state.renderParamsList.forEach((params) => {
    state.aesthetic.renderComponentStyles(styleSheet, params);
  });
}
