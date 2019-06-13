import React from 'react';
import Aesthetic, { ThemeName } from 'aesthetic';
import ThemeContext from './ThemeContext';
import { ThemeContextShape } from './types';

export interface ThemeProviderProps {
  aesthetic: Aesthetic<any, any, any>;
  children: NonNullable<React.ReactNode>;
  name?: ThemeName;
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

  componentDidMount() {
    const { name } = this.props;

    if (name && name !== this.state.theme) {
      this.changeTheme(name);
    }
  }

  componentDidUpdate(prevProps: ThemeProviderProps) {
    const { name } = this.props;

    if (name && name !== prevProps.name) {
      this.changeTheme(name);
    }
  }

  changeTheme = (theme: ThemeName) => {
    this.props.aesthetic.changeTheme(theme);
    this.ctx!.themeName = theme;
    this.setState({ theme });
  };

  render() {
    if (!this.ctx) {
      this.ctx = {
        changeTheme: this.changeTheme,
        themeName: this.state.theme,
      };
    }

    return <ThemeContext.Provider value={this.ctx!}>{this.props.children}</ThemeContext.Provider>;
  }
}
