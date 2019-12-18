import { useContext } from 'react';
import aesthetic, { ThemeSheet } from 'aesthetic';
import ThemeContext from './ThemeContext';

/**
 * Hook within a component to provide the current theme object.
 */
export default function useTheme<Theme = ThemeSheet>(): Theme {
  const themeName = useContext(ThemeContext);

  return aesthetic.getTheme(themeName);
}
