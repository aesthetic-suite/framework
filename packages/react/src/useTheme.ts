import { useContext } from 'react';
import aesthetic, { ThemeSheet } from 'aesthetic';
import ThemeContext from './ThemeContext';

/**
 * Hook within a component to provide the current theme object.
 */
export default function useTheme<T = ThemeSheet>(): T {
  const themeName = useContext(ThemeContext);

  return aesthetic.getTheme(themeName);
}
