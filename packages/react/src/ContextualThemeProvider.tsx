import React, { useState, useEffect } from 'react';
import { getTheme, renderThemeStyles } from '@aesthetic/core';
import ThemeContext from './ThemeContext';
import useDirection from './useDirection';
import { ThemeProviderProps } from './types';

/**
 * Rendered nested within the page to provide a contextual theme.
 */
export default function ContextualThemeProvider({ children, name }: Required<ThemeProviderProps>) {
  const [className, setClassName] = useState('');
  const direction = useDirection();
  const theme = getTheme(name);

  // Render styles when theme/direction change
  useEffect(() => {
    setClassName(renderThemeStyles(theme, { direction }));
  }, [theme, direction]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className={className} data-theme={name}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
