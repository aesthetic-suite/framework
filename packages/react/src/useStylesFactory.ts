import { useContext, useRef, useLayoutEffect } from 'react';
import Aesthetic, { ClassNameTransformer, StyleSheetDefinition, SheetMap } from 'aesthetic';
import uuid from 'uuid/v4';
import DirectionContext from './DirectionContext';
import ThemeContext from './ThemeContext';
import { UseStylesOptions } from './types';

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
    options: UseStylesOptions = {},
  ): [SheetMap<ParsedBlock>, CX, string] {
    const { styleName: customName } = options;
    const ref = useRef<string>();
    const dir = useContext(DirectionContext);
    const themeName = useContext(ThemeContext);
    let styleName = '';

    // Only register the style sheet once
    if (ref.current) {
      styleName = ref.current;
    } else {
      styleName = customName || uuid();
      ref.current = styleName;
      aesthetic.registerStyleSheet(styleName, styleSheet);
    }

    // Create a unique style sheet for this component
    const params = { dir, name: styleName, theme: themeName };
    const sheet = aesthetic.createStyleSheet(styleName, params);

    // Flush styles on mount
    useLayoutEffect(() => {
      aesthetic.flushStyles(styleName);
    }, [dir, styleName, themeName]);

    // Create a CSS transformer
    const cx: CX = (...styles) => aesthetic.transformStyles(styles, params);

    return [sheet, cx, styleName];
  };
}
