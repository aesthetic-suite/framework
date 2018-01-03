/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Aesthetic from './Aesthetic';

import type {
  HOCComponent,
  HOCOptions,
  HOCWrappedComponent,
  HOCWrapper,
  StyleSheet,
  StyleSheetCallback,
  ThemeSheet,
} from '../../types';

type StyleProps = {
  themeName: string,
};

type StyleState = {
  styles?: StyleSheet,
  theme?: ThemeSheet,
  themeName: string,
};

// Keep track in production
let instanceID = 0;

export default function style(
  aesthetic: Aesthetic,
  styleSheet: StyleSheet | StyleSheetCallback = {},
  options?: HOCOptions = {},
): HOCWrapper {
  return function wrapStyles(Component: HOCWrappedComponent): HOCComponent {
    let styleName = options.styleName || Component.displayName || Component.name;

    // Function/constructor name aren't always available when code is minified,
    // so only use it in development.
    /* istanbul ignore else */
    if (__DEV__) {
      if (!(aesthetic instanceof Aesthetic)) {
        throw new TypeError('An instance of `Aesthetic` is required.');

      } else if (!styleName) {
        /* istanbul ignore next Hard to test */
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

    // When in production, we should generate a random string to use as the style name.
    // If we don't do this, any minifiers that mangle function names would break
    // Aesthetic's caching layer.
    } else {
      instanceID += 1;
      styleName = `${Math.random().toString(32).substr(2)}${instanceID}`;
    }

    const {
      extendable = aesthetic.options.extendable,
      extendFrom = '',
      pure = aesthetic.options.pure,
      stylesPropName = aesthetic.options.stylesPropName,
      themePropName = aesthetic.options.themePropName,
    } = options;
    const ParentComponent = (pure && React.PureComponent) ? React.PureComponent : React.Component;

    // Set base styles
    aesthetic.setStyles(styleName, styleSheet, extendFrom);

    // $FlowIgnore Silence polymorphic errors
    class StyledComponent extends ParentComponent<StyleProps, StyleState> {
      static displayName: ?string = `Aesthetic(${styleName})`;

      static styleName: string = styleName;

      static WrappedComponent: HOCWrappedComponent = Component;

      static contextTypes = {
        themeName: PropTypes.string,
      };

      static propTypes = {
        themeName: PropTypes.string,
      };

      static defaultProps = {
        themeName: '',
      };

      // Allow consumers to customize styles
      static extendStyles(
        customStyleSheet?: StyleSheet | StyleSheetCallback = {},
        extendOptions?: HOCOptions = {},
      ): HOCComponent {
        if (__DEV__) {
          if (!extendable) {
            throw new Error(`${styleName} is not extendable.`);
          }
        }

        return style(aesthetic, customStyleSheet, {
          ...options,
          ...extendOptions,
          extendFrom: styleName,
        })(Component);
      }

      state = {
        firstMount: true,
        [stylesPropName]: {},
        themeName: '',
        [themePropName]: {},
      };

      componentWillMount() {
        this.transformStyles(this.props);
      }

      componentWillReceiveProps(nextProps: StyleProps) {
        this.transformStyles(nextProps);
      }

      getThemeName(props: StyleProps): string {
        return props.themeName ||
          this.context.themeName ||
          aesthetic.options.defaultTheme ||
          '';
      }

      transformStyles(props: Object) {
        const themeName = this.getThemeName(props);

        if (this.state.firstMount || themeName !== this.state.themeName) {
          this.setState({
            firstMount: false,
            [stylesPropName]: aesthetic.createStyleSheet(styleName, themeName, props),
            themeName,
            [themePropName]: themeName ? aesthetic.getTheme(themeName) : {},
          });
        }
      }

      render(): React$Node {
        const { firstMount, ...state } = this.state;

        return <Component {...this.props} {...state} />;
      }
    }

    return hoistNonReactStatics(StyledComponent, Component);
  };
}
