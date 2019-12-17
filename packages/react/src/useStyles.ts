import { useContext, useEffect, useLayoutEffect } from 'react';
import aesthetic, {
  ClassNameTransformer,
  CompiledStyleSheet,
  StyleName,
  StyleSheetFactory,
  ThemeSheet,
} from 'aesthetic';
import DirectionContext from './DirectionContext';
import ThemeContext from './ThemeContext';

const useSideEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStyles<T>(
  factory: StyleSheetFactory<ThemeSheet, T>,
): [CompiledStyleSheet, ClassNameTransformer, StyleName] {
  const dir = useContext(DirectionContext);
  const themeName = useContext(ThemeContext);
  const styleName = aesthetic.registerStyleSheet(factory);
  const options = { dir, name: styleName, theme: themeName };

  // Create a unique style sheet for this component
  const styleSheet = aesthetic.getAdapter().createStyleSheet(styleName, options);

  // Flush styles on mount
  useSideEffect(() => {
    aesthetic.getAdapter().flushStyles(styleName);
  }, [dir, styleName, themeName]);

  // Create a CSS transformer
  const cx: ClassNameTransformer = (...styles) =>
    aesthetic.getAdapter().transformStyles(styles, options);

  return [styleSheet, cx, styleName];
}
