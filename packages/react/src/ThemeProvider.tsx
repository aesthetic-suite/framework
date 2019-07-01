import React from 'react';
import ThemeContext from './ThemeContext';
import { ThemeProviderProps, ThemeProviderState } from './types';

export default class ThemeProvider extends React.PureComponent<
  ThemeProviderProps,
  ThemeProviderState
> {
  state = {
    themeName: this.props.name || this.props.aesthetic.options.theme,
  };

  componentDidUpdate(prevProps: ThemeProviderProps) {
    const { name } = this.props;

    if (name && name !== prevProps.name) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        themeName: name,
      });
    }
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state.themeName}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
