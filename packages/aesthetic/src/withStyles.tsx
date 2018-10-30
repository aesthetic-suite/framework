/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Aesthetic from './Aesthetic';
import ThemeContext from './ThemeContext';
import { ThemeName, StyleName, StyleSheetDefinition, StyleSheetMap } from './types';

export interface WithStylesWrapperProps {
  themeName?: ThemeName;
  wrappedRef?: React.Ref<any>;
}

export interface WithStylesProps<Theme, ParsedBlock> {
  ref?: React.Ref<any>;
  styles: StyleSheetMap<ParsedBlock>;
  theme?: Theme;
  themeName?: ThemeName;
}

export interface WithStylesState<Theme, ParsedBlock> {
  styles: StyleSheetMap<ParsedBlock>;
  theme: Theme;
  themeName: ThemeName;
}

export interface WithStylesOptions {
  extendable: boolean;
  extendFrom: string;
  passThemeNameProp: boolean;
  passThemeProp: boolean;
  pure: boolean;
  styleName: StyleName;
  stylesPropName: string;
  themePropName: string;
}

export type WithStylesReturnSignature<Props, Theme, ParsedBlock> = (
  WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
) => React.ComponentType<Props & WithStylesWrapperProps>;

// Keep track in production
let instanceID = 0;

export default function withStyles<Theme, NativeBlock, ParsedBlock = NativeBlock>(
  aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>,
  styleSheet: StyleSheetDefinition<Theme>,
  options: Partial<WithStylesOptions> = {},
) {
  return function<Props>(
    WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
  ): React.ComponentType<Props & WithStylesWrapperProps> {
    let styleName = options.styleName || WrappedComponent.displayName || WrappedComponent.name;

    // Function/constructor name aren't always available when code is minified,
    // so only use it in development.
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
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
    const Component = pure && React.PureComponent ? React.PureComponent : React.Component;

    // Set base styles
    aesthetic.setStyles(styleName, styleSheet, extendFrom);

    class WithStyles extends Component<
      WithStylesWrapperProps,
      WithStylesState<Theme, ParsedBlock>
    > {
      static displayName: string = `withAestheticStyles(${styleName})`;

      static styleName: string = styleName;

      static WrappedComponent = WrappedComponent;

      static defaultProps = {
        themeName: '',
      };

      state = this.transformStyles(this.getThemeName(this.props));

      // Allow consumers to customize styles
      static extendStyles(
        customStyleSheet: StyleSheetDefinition<Theme, Props>,
        extendOptions: Partial<WithStylesOptions> = {},
      ) {
        if (process.env.NODE_ENV !== 'production') {
          if (!extendable) {
            throw new Error(`${styleName} is not extendable.`);
          }
        }

        return withStyles(aesthetic, customStyleSheet, {
          ...options,
          ...extendOptions,
          extendFrom: styleName,
        })(WrappedComponent);
      }

      componentDidUpdate(prevProps: WithStylesWrapperProps) {
        const themeName = this.getThemeName(this.props);

        if (themeName !== this.getThemeName(prevProps)) {
          this.setState(this.transformStyles(themeName));
        }
      }

      getThemeName(props: WithStylesWrapperProps): ThemeName {
        return props.themeName || aesthetic.options.defaultTheme || '';
      }

      getWrappedProps(): Props {
        return {
          // @ts-ignore
          ...WrappedComponent.defaultProps,
          ...this.props,
        };
      }

      transformStyles(themeName: ThemeName): WithStylesState<Theme, ParsedBlock> {
        return {
          styles: aesthetic.createStyleSheet<Props>(styleName, themeName, this.getWrappedProps()),
          theme: aesthetic.getTheme(themeName),
          themeName,
        };
      }

      render() {
        const { state } = this;
        const { themeName, wrappedRef, ...props } = this.props;
        const extraProps: WithStylesProps<Theme, ParsedBlock> = {
          [stylesPropName as 'styles']: state.styles,
        };

        if (passThemeProp) {
          extraProps[themePropName as 'theme'] = state.theme;
        }

        if (passThemeNameProp) {
          extraProps.themeName = state.themeName;
        }

        if (wrappedRef) {
          extraProps.ref = wrappedRef;
        }

        return <Component {...props} {...extraProps} />;
      }
    }

    function WithStylesWrapper(props: WithStylesWrapperProps) {
      return (
        <ThemeContext.Consumer>
          {themeName => <WithStyles themeName={themeName} {...props} />}
        </ThemeContext.Consumer>
      );
    }

    return hoistNonReactStatics(WithStylesWrapper, Component);
  };
}
