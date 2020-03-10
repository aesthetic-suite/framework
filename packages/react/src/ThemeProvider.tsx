import React, { useState, useEffect, useContext } from 'react';
import { changeTheme, getActiveTheme, getTheme, renderThemeStyles } from '@aesthetic/core';
import ThemeContext from './ThemeContext';
import { ThemeProviderProps } from './types';

/**
 * Explicitly set the current theme by name. If the theme does not exist,
 * an error will be thrown.
 */
export default function ThemeProvider({ children, name = '' }: ThemeProviderProps) {
  const contextual = useContext(ThemeContext) !== null;
  const [themeName, setThemeName] = useState(name);
  const [className, setClassName] = useState('');
  const theme = themeName ? getTheme(themeName) : getActiveTheme();

  if (__DEV__) {
    if (contextual && !name) {
      throw new Error(
        'Contextual themeing requires all nested `ThemeProvider`s to provide a `name` prop.',
      );
    }
  }

  useEffect(() => {
    if (name) {
      if (!contextual) {
        changeTheme(name);
      }

      setThemeName(name);
    }
  }, [name, contextual]);

  useEffect(() => {
    if (contextual) {
      setClassName(renderThemeStyles(theme));
    }
  }, [theme, contextual]);

  const content = <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;

  // This enables contextual themeing
  if (contextual && className) {
    return (
      <div className={className} data-theme={theme.name}>
        {content}
      </div>
    );
  }

  return content;
}
