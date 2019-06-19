import React from 'react';
import { ThemeName } from 'aesthetic';
import ThemeContext from './ThemeContext';
import { ThemeContextShape, ThemeProviderProps, ThemeProviderState } from './types';

export default class ThemeProvider extends React.PureComponent<
  ThemeProviderProps,
  ThemeProviderState
> {
  ctx?: ThemeContextShape;

  state = {
    themeName: this.props.aesthetic.options.theme,
  };

  componentDidMount() {
    const { name } = this.props;

    if (name && name !== this.state.themeName) {
      this.changeTheme(name);
    }
  }

  componentDidUpdate(prevProps: ThemeProviderProps) {
    const { name } = this.props;

    if (name && name !== prevProps.name) {
      this.changeTheme(name);
    }
  }

  changeTheme = (themeName: ThemeName) => {
    const { aesthetic } = this.props;

    aesthetic.changeTheme(themeName);

    this.ctx = {
      changeTheme: this.changeTheme,
      theme: aesthetic.getTheme(themeName),
      themeName,
    };

    this.setState({ themeName });
  };

  render() {
    if (!this.ctx) {
      this.ctx = {
        changeTheme: this.changeTheme,
        theme: this.props.aesthetic.getTheme(this.state.themeName),
        themeName: this.state.themeName,
      };
    }

    return <ThemeContext.Provider value={this.ctx!}>{this.props.children}</ThemeContext.Provider>;
  }
}
