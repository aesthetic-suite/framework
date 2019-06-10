import React from 'react';
import Aesthetic, { ThemeName } from 'aesthetic';
import ThemeContext from './ThemeContext';
import { ThemeContextShape } from './types';

export interface ThemeProviderProps {
  aesthetic: Aesthetic<any, any, any>;
  children: NonNullable<React.ReactNode>;
}

export interface ThemeProviderState {
  theme: ThemeName;
}

export default class ThemeProvider extends React.PureComponent<
  ThemeProviderProps,
  ThemeProviderState
> {
  ctx?: ThemeContextShape;

  state = {
    theme: this.props.aesthetic.options.theme,
  };

  changeTheme = (theme: ThemeName) => {
    this.props.aesthetic.changeTheme(theme);
    this.ctx!.theme = theme;
    this.setState({ theme });
  };

  render() {
    if (!this.ctx) {
      this.ctx = {
        changeTheme: this.changeTheme,
        theme: this.state.theme,
      };
    }

    return <ThemeContext.Provider value={this.ctx!}>{this.props.children}</ThemeContext.Provider>;
  }
}
