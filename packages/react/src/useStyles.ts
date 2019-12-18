import { useContext, useRef, useEffect, useLayoutEffect } from 'react';
import aesthetic, {
  ClassNameTransformer,
  CompiledStyleSheet,
  StyleName,
  StyleSheetFactory,
  ThemeSheet,
} from 'aesthetic';
import uuid from 'uuid/v4';
import DirectionContext from './DirectionContext';
import ThemeContext from './ThemeContext';
import { UseStylesOptions } from './types';

const useSideEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStyles<Theme = ThemeSheet, T = {}>(
  styleSheet: StyleSheetFactory<Theme, T>,
  options: UseStylesOptions = {},
): [CompiledStyleSheet, ClassNameTransformer, StyleName] {
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

    if (!aesthetic.styleSheets[styleName]) {
      aesthetic.registerStyleSheet(styleName, styleSheet);
    }
  }

  // Create a unique style sheet for this component
  const params = { dir, name: styleName, theme: themeName };
  const sheet = aesthetic.getAdapter().createStyleSheet(styleName, params);

  // Flush styles on mount
  useSideEffect(() => {
    aesthetic.getAdapter().flushStyles(styleName);
  }, [dir, styleName, themeName]);

  // Create a CSS transformer
  const cx: ClassNameTransformer = (...styles) =>
    aesthetic.getAdapter().transformStyles(styles, params);

  return [sheet, cx, styleName];
}
