import { useEffect, useLayoutEffect, useState } from 'react';
import { LocalSheet, renderComponentStyles, ClassNameSheet } from '@aesthetic/core';
import { arrayReduce } from '@aesthetic/utils';
import { ClassNameGenerator } from './types';
import useDirection from './useDirection';
import useTheme from './useTheme';

const useSideEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStyles<T = unknown>(sheet: LocalSheet<T>): ClassNameGenerator<keyof T> {
  const direction = useDirection();
  const theme = useTheme();
  const [classNames, setClassNames] = useState<ClassNameSheet<string>>({});

  useSideEffect(() => {
    setClassNames(
      renderComponentStyles(sheet, {
        direction,
        theme: theme.name,
      }),
    );
  }, [direction, theme]);

  return (...keys) =>
    arrayReduce(keys, key => (key && classNames[key] ? ` ${classNames[key]}` : '')).trim();
}
