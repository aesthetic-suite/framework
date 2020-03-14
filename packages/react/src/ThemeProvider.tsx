import React, { useState, useEffect, useCallback } from 'react';
import { changeTheme, getActiveTheme, getTheme, subscribe, unsubscribe } from '@aesthetic/core';
import ThemeContext from './ThemeContext';
import { ThemeProviderProps } from './types';

/**
 * Rendered at the root to provide the theme to the entire application.
 */
export default function ThemeProvider({ children, name = '' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState(name);
  const theme = themeName ? getTheme(themeName) : getActiveTheme();

  // Listen to theme changes that occur outside of the provider
  const handleChangeTheme = useCallback(
    nextTheme => {
      if (nextTheme !== themeName) {
        setThemeName(nextTheme);
      }
    },
    [themeName],
  );

  useEffect(() => {
    subscribe('change:theme', handleChangeTheme);

    return () => {
      unsubscribe('change:theme', handleChangeTheme);
    };
  }, [handleChangeTheme]);

  // Update state when the `name` prop changes
  useEffect(() => {
    if (name) {
      changeTheme(name, false);
      setThemeName(name);
    }
  }, [name]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
