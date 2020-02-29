import React, { useState, useEffect } from 'react';
import { changeTheme, getActiveTheme, getTheme } from '@aesthetic/core';
import ThemeContext from './ThemeContext';
import { ThemeProviderProps } from './types';

/**
 * Explicitly set the current theme by name. If the theme does not exist,
 * an error will be thrown.
 */
export default function ThemeProvider({ children, name: baseName = '' }: ThemeProviderProps) {
  const [name, setName] = useState(baseName);
  const theme = name ? getTheme(name) : getActiveTheme();

  useEffect(() => {
    if (baseName) {
      setName(baseName);
      changeTheme(baseName);
    }
  }, [baseName]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
