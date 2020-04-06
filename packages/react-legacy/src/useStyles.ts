import { useContext, useRef, useEffect, useLayoutEffect, useState } from 'react';
import aesthetic, {
  ClassNameTransformer,
  CompiledStyleSheet,
  StyleName,
  StyleSheetFactory,
  ThemeSheet,
  SheetMap,
} from 'aesthetic';
import { v4 as uuid } from 'uuid';
import DirectionContext from './DirectionContext';
import ThemeContext from './ThemeContext';
import { UseStylesOptions } from './types';

const useSideEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStyles<Theme = ThemeSheet, T = unknown>(
  styleSheet: StyleSheetFactory<Theme, T>,
  options: UseStylesOptions = {},
): [CompiledStyleSheet, ClassNameTransformer, StyleName] {
  const { styleName: customName } = options;
  const adapter = aesthetic.getAdapter();
  const ref = useRef<string>();
  const dir = useContext(DirectionContext);
  const theme = useContext(ThemeContext);
  let name = '';

  // Only register the style sheet once
  if (ref.current) {
    name = ref.current;
  } else {
    name = customName || uuid();
    ref.current = name;

    if (!aesthetic.styleSheets[name]) {
      aesthetic.registerStyleSheet(name, styleSheet);
    }
  }

  // Create a unique style sheet for this component
  const [sheet, setSheet] = useState<SheetMap<object>>({});

  useSideEffect(() => {
    setSheet(adapter.createStyleSheet(name, { dir, name, theme }));

    adapter.flushStyles(name);
  }, [dir, name, theme]);

  // Create a CSS transformer
  const cx: ClassNameTransformer = (...styles) =>
    adapter.transformStyles(styles, { dir, name, theme });

  return [sheet, cx, name];
}
