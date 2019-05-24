import { useState, useLayoutEffect } from 'react';
import Aesthetic, { ClassNameTransformer, StyleSheetDefinition, SheetMap } from 'aesthetic';
import uuid from 'uuid/v4';

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStylesFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  type CX = ClassNameTransformer<NativeBlock, ParsedBlock>;

  return function useStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    customName: string = 'Component',
  ): [SheetMap<ParsedBlock>, CX, string] {
    const [styleName] = useState(() => {
      const name = `${customName}-${uuid()}`;

      aesthetic.setStyleSheet(name, styleSheet);

      return name;
    });

    // Create a unique style sheet for this component
    const sheet = aesthetic.createStyleSheet(styleName);

    // Flush styles on mount
    useLayoutEffect(() => {
      aesthetic.flushStyles(styleName);
    }, [styleName]);

    // Create a CSS transformer
    const cx: CX = (...styles) => aesthetic.transformStyles(styles);

    return [sheet, cx, styleName];
  };
}
