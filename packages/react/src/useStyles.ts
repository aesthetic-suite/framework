import { useState, useEffect, useLayoutEffect } from 'react';
import { LocalSheet, renderComponentStyles, ClassNameSheet } from '@aesthetic/core';
import { isSSR, arrayLoop, isObject, objectLoop } from '@aesthetic/utils';
import { ClassNameGenerator } from './types';
import useDirection from './useDirection';
import useTheme from './useTheme';

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStyles<T = unknown>(sheet: LocalSheet<T>): ClassNameGenerator<keyof T> {
  const direction = useDirection();
  const theme = useTheme();
  const ssr = isSSR() || global.AESTHETIC_CUSTOM_RENDERER;

  // Render the styles immediately for SSR and tests
  const [classNames, setClassNames] = useState<ClassNameSheet<string>>(() => {
    if (ssr || process.env.NODE_ENV === 'test') {
      return renderComponentStyles(sheet, {
        direction,
        theme: theme.name,
      });
    }

    // istanbul ignore next
    return {};
  });

  // Re-render styles when the theme or direction change
  const useSideEffect = ssr ? useEffect : useLayoutEffect;

  useSideEffect(() => {
    setClassNames(
      renderComponentStyles(sheet, {
        direction,
        theme: theme.name,
      }),
    );
  }, [direction, theme]);

  // Generate class names on demand
  return (...keys) => {
    const list: string[] = [];

    arrayLoop(keys, (key) => {
      if (isObject(key)) {
        objectLoop(key, (value, type) => {
          if (!value || !type) {
            return;
          }

          const variant = `${type}_${value}`;

          objectLoop(classNames, (clx) => {
            if (clx?.variants?.[variant]) {
              list.push(clx.variants[variant]);
            }
          });
        });
      } else if (typeof key === 'string' && classNames[key]?.class) {
        list.push(classNames[key]!.class);
      }
    });

    return list.join(' ');
  };
}
