/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';

type ThemeProviderProps = {
  children: React$Node,
  name: string,
};

export default class ThemeProvider extends React.Component<ThemeProviderProps> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
  };

  static childContextTypes = {
    themeName: PropTypes.string,
  };

  getChildContext() {
    return {
      themeName: this.props.name,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}
