import React from 'react';
import { ThemeContextShape } from './types';

export default React.createContext<ThemeContextShape>({
  changeTheme() {},
  theme: {},
  themeName: 'default',
});
