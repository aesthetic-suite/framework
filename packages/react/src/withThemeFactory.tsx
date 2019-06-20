/* eslint-disable max-classes-per-file, react/no-multi-comp */

import React from 'react';
import Aesthetic from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import ThemeContext from './ThemeContext';
import {
  WithThemeOptions,
  WithThemeContextProps,
  WithThemeWrappedProps,
  WithThemeWrapperProps,
} from './types';

/**
 * Wrap a React component with an HOC that injects the current theme object as a prop.
 */
export default function withThemeFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  return function withTheme(options: WithThemeOptions = {}) /* infer */ {
    const {
      pure = aesthetic.options.pure,
      themePropName = aesthetic.options.themePropName,
    } = options;

    return function withThemeComposer<Props extends object = {}>(
      WrappedComponent: React.ComponentType<Props & WithThemeWrappedProps<Theme>>,
    ): React.ComponentClass<Props & WithThemeWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const Component = pure ? React.PureComponent : React.Component;

      // eslint-disable-next-line react/prefer-stateless-function
      class WithTheme extends Component<Props & WithThemeContextProps & WithThemeWrapperProps> {
        render() {
          const { themeName, wrappedRef, ...props } = this.props;
          const extraProps: WithThemeWrappedProps<Theme> = {
            [themePropName as 'theme']: aesthetic.getTheme(themeName),
            ref: wrappedRef,
          };

          return <WrappedComponent {...props as any} {...extraProps} />;
        }
      }

      class WithThemeConsumer extends React.Component<Props & WithThemeWrapperProps> {
        static displayName = `withTheme(${baseName})`;

        static WrappedComponent = WrappedComponent;

        render() {
          return (
            <ThemeContext.Consumer>
              {theme => <WithTheme {...this.props} themeName={theme.themeName} />}
            </ThemeContext.Consumer>
          );
        }
      }

      hoistNonReactStatics(WithThemeConsumer, WrappedComponent);

      return WithThemeConsumer;
    };
  };
}
