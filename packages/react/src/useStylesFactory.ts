import { useContext, useState, useLayoutEffect } from 'react';
import Aesthetic, { ClassNameTransformer, StyleSheetDefinition, SheetMap, isRTL } from 'aesthetic';
import uuid from 'uuid/v4';
import DirectionContext from './DirectionContext';

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
    const dir = useContext(DirectionContext);
    const [styleName] = useState(() => {
      const name = `${customName}-${uuid()}`;

      aesthetic.registerStyleSheet(name, styleSheet);

      return name;
    });

    // Create a unique style sheet for this component
    const options = { name: styleName, rtl: isRTL(dir) };
    const sheet = aesthetic.createStyleSheet(styleName, options);

    // Flush styles on mount
    useLayoutEffect(() => {
      aesthetic.flushStyles(styleName);
    }, [dir, styleName]);

    // Create a CSS transformer
    const cx: CX = (...styles) => aesthetic.transformStyles(styles, options);

    return [sheet, cx, styleName];
  };
}
