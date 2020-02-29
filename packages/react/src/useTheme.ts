import { useContext } from 'react';
import { Theme } from '@aesthetic/core';
import ThemeContext from './ThemeContext';

/**
 * Hook within a component to provide the current theme object.
 */
export default function useTheme(): Theme {
  const theme = useContext(ThemeContext);

  if (__DEV__) {
    if (!theme) {
      throw new Error('Theme has not been provided.');
    }
  }

  return theme!;
}
