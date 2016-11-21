/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-unused-prop-types */

import React, { PropTypes } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Aesthetic from './Aesthetic';

import type {
  StyleDeclarationMap,
  WrappedComponent,
  HOCComponent,
  HOCOptions,
} from './types';

export default function style(
  defaultStyles: StyleDeclarationMap = {},
  options: HOCOptions = {},
): (WrappedComponent) => HOCComponent {
  return function wrapStyles(Component: WrappedComponent): HOCComponent {
    const styleName: string = options.styleName || Component.displayName || Component.name;
    const {
      stylesPropName = 'styles',
      themePropName = 'theme',
      allowStyling = false,
    } = options;

    if (!styleName) {
      throw new Error(
        'A component name could not be derived. Please provide a unique ' +
        'name through `options.styleName` or a component `displayName`.',
      );
    }

    class StyledComponent extends React.Component {
      static displayName: string = `Aesthetic(${styleName})`;

      static wrappedComponent: WrappedComponent = Component;

      static propTypes = {
        [themePropName]: PropTypes.string,
      };

      static contextTypes = {
        themeName: PropTypes.string,
      };

      render() {
        const theme = this.props[themePropName] || this.context.themeName || '';
        const props = {
          ...this.props,
          [stylesPropName]: Aesthetic.getStyles(styleName, theme),
          [themePropName]: theme,
        };

        return (
          <Component {...props} />
        );
      }
    }

    // Set default styles
    Aesthetic.setStyles(styleName, defaultStyles);

    // Allow consumers to override styles
    if (allowStyling) {
      StyledComponent.setStyles = function setStyles(declarations: StyleDeclarationMap) {
        Aesthetic.setStyles(styleName, declarations);
      };
    }

    return hoistNonReactStatics(StyledComponent, Component);
  };
}
