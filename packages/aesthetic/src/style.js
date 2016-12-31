/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/sort-comp */

import React, { PropTypes } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Aesthetic from './Aesthetic';

import type {
  StyleOrCallback,
  WrappedComponent,
  HOCComponent,
  HOCOptions,
} from '../../types';

export default function style(
  aesthetic: Aesthetic,
  defaultStyles: StyleOrCallback = {},
  options: HOCOptions = {},
): (WrappedComponent) => HOCComponent {
  return function wrapStyles(Component: WrappedComponent): HOCComponent {
    const styleName: string = options.styleName || Component.displayName || Component.name;
    const {
      stylesPropName = 'styles',
      themePropName = 'theme',
      lockStyling = true,
    } = options;

    if (process.env.NODE_ENV === 'development') {
      if (!styleName) {
        throw new Error(
          'A component name could not be derived. Please provide a unique ' +
          'name using `options.styleName` or `displayName`.',
        );

      } else if (aesthetic.styles[styleName]) {
        throw new Error(
          `A component has already been styled under the name "${styleName}". ` +
          'Either rename the component or define `options.styleName`.',
        );
      }
    }

    // Set default styles
    aesthetic.setStyles(styleName, defaultStyles);

    if (lockStyling) {
      aesthetic.lockStyling(styleName);
    }

    class StyledComponent extends React.Component {
      props: {
        theme: string,
      };

      state: {
        styles: ClassNames,
        theme: string,
      };

      static displayName: string = `Aesthetic(${styleName})`;

      static styleName: string = styleName;

      static wrappedComponent: WrappedComponent = Component;

      static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        [themePropName]: PropTypes.string,
      };

      static contextTypes = {
        themeName: PropTypes.string,
      };

      // Allow consumers to set styles
      static setStyles(declarations: StyleOrCallback) {
        aesthetic.setStyles(styleName, declarations).lockStyling(styleName);
      }

      // Start transforming styles before we mount
      componentWillMount() {
        const theme = this.props[themePropName] || this.context.themeName || '';
        const styles = aesthetic.transformStyles(styleName, theme);

        this.setState({
          [themePropName]: theme,
          [stylesPropName]: styles,
        });
      }

      render() {
        return (
          <Component {...this.props} {...this.state} />
        );
      }
    }

    return hoistNonReactStatics(StyledComponent, Component);
  };
}
