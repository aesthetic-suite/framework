import { useEffect, useLayoutEffect, useState } from 'react';
import { LocalSheet, renderComponentStyles, StringOnly, ClassNameSheet } from '@aesthetic/core';
import { arrayReduce } from '@aesthetic/utils';
import { ClassNameTransformer } from './types';
import useDirection from './useDirection';
import useTheme from './useTheme';

const useSideEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Hook within a component to provide a style sheet.
 */
export default function useStyles<T = unknown>(
  sheet: LocalSheet<T>,
): ClassNameTransformer<StringOnly<keyof T>> {
  const dir = useDirection();
  const theme = useTheme();
  const [classNames, setClassNames] = useState<ClassNameSheet<string>>({});

  useSideEffect(() => {
    setClassNames(
      renderComponentStyles(sheet, {
        dir,
        theme: theme.name,
      }),
    );
  }, [dir, theme]);

  return (...keys) =>
    arrayReduce(keys, key => (key && classNames[key] ? ` ${classNames[key]}` : '')).trim();
}
