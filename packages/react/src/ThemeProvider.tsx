import React, { useState, useEffect } from 'react';
import { changeTheme, getActiveTheme, getTheme, renderThemeStyles } from '@aesthetic/core';
import ThemeContext from './ThemeContext';
import { ThemeProviderProps } from './types';

/**
 * Explicitly set the current theme by name. If the theme does not exist,
 * an error will be thrown.
 */
export default function ThemeProvider({ children, name = '', root = false }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState(name);
  const [className, setClassName] = useState('');
  const theme = themeName ? getTheme(themeName) : getActiveTheme();

  useEffect(() => {
    if (name) {
      changeTheme(name);
      setThemeName(name);
    }
  }, [name]);

  useEffect(() => {
    if (!root) {
      setClassName(renderThemeStyles(theme));
    }
  }, [theme, root]);

  const content = <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;

  // This enables contextual themeing
  if (className) {
    return (
      <div className={className} data-theme={theme.name}>
        {content}
      </div>
    );
  }

  return content;
}
