import React from 'react';
import Aesthetic from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { WithThemeOptions, WithThemeProps, WithThemeWrapperProps } from './types';

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
      WrappedComponent: React.ComponentType<Props & WithThemeProps<Theme>>,
    ): React.ComponentClass<Props & WithThemeWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const Component = pure ? React.PureComponent : React.Component;

      class WithTheme extends Component<Props & WithThemeWrapperProps> {
        static displayName = `withTheme(${baseName})`;

        static WrappedComponent = WrappedComponent;

        render() {
          const { wrappedRef, ...props } = this.props;
          const extraProps: WithThemeProps<Theme> = {
            [themePropName as 'theme']: aesthetic.getTheme(),
            ref: wrappedRef,
          };

          return React.createElement(WrappedComponent, {
            ...props,
            ...extraProps,
          } as any);
        }
      }

      hoistNonReactStatics(WithTheme, WrappedComponent);

      return WithTheme;
    };
  };
}
