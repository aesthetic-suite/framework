/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { Children, PropTypes } from 'react';

export default class ThemeProvider extends React.Component {
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
