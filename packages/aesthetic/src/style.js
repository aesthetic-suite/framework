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
  wrappedRef: ?React$Ref<React$ElementType>,
};

type StyleState = {
  styles: StyleSheet,
  theme: ThemeSheet,
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
      styleName = `c${Math.random()
        .toString(32)
        .substr(2)}${instanceID}`;
    }

    const {
      extendable = aesthetic.options.extendable,
      extendFrom = '',
      passThemeNameProp = aesthetic.options.passThemeNameProp,
      passThemeProp = aesthetic.options.passThemeProp,
      pure = aesthetic.options.pure,
      stylesPropName = aesthetic.options.stylesPropName,
      themePropName = aesthetic.options.themePropName,
    } = options;
    const ParentComponent = pure && React.PureComponent ? React.PureComponent : React.Component;

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
        wrappedRef: PropTypes.func,
      };

      static defaultProps = {
        themeName: '',
        wrappedRef: null,
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

      // eslint-disable-next-line flowtype/no-weak-types
      constructor(props: StyleProps, context: any) {
        super(props, context);

        this.state = this.transformStyles(this.getThemeName(props));
      }

      componentDidUpdate(prevProps: StyleProps) {
        const themeName = this.getThemeName(this.props);

        if (themeName !== this.getThemeName(prevProps)) {
          this.setState(this.transformStyles(themeName));
        }
      }

      getThemeName(props: StyleProps): string {
        return props.themeName || this.context.themeName || aesthetic.options.defaultTheme || '';
      }

      getWrappedProps(): Object {
        return {
          // $FlowIgnore
          ...Component.defaultProps,
          ...this.props,
        };
      }

      transformStyles(themeName: string): StyleState {
        return {
          styles: aesthetic.createStyleSheet(styleName, themeName, this.getWrappedProps()),
          theme: themeName ? aesthetic.getTheme(themeName) : {},
          themeName,
        };
      }

      render(): React$Node {
        const { state } = this;
        const { themeName, wrappedRef, ...props } = this.props;
        const extraProps = {
          [stylesPropName]: state.styles,
        };

        if (passThemeProp) {
          extraProps[themePropName] = state.theme;
        }

        if (passThemeNameProp) {
          // $FlowIgnore
          extraProps.themeName = state.themeName;
        }

        if (wrappedRef) {
          // $FlowIgnore
          extraProps.ref = wrappedRef;
        }

        return <Component {...props} {...extraProps} />;
      }
    }

    return hoistNonReactStatics(StyledComponent, Component);
  };
}
