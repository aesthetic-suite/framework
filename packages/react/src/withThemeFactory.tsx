import React, { useContext } from 'react';
import Aesthetic from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import ThemeContext from './ThemeContext';
import { WithThemeOptions, WithThemeWrappedProps, WithThemeWrapperProps } from './types';

/**
 * Wrap a React component with an HOC that injects the current theme object as a prop.
 */
export default function withThemeFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  return function withTheme(options: WithThemeOptions = {}) /* infer */ {
    const { themePropName = aesthetic.options.themePropName } = options;

    return function withThemeComposer<Props extends object = {}>(
      WrappedComponent: React.ComponentType<Props & WithThemeWrappedProps<Theme>>,
    ): React.FunctionComponent<Props & WithThemeWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;

      function WithTheme({ wrappedRef, ...props }: Props & WithThemeWrapperProps) {
        const theme = useContext(ThemeContext);
        const extraProps: WithThemeWrappedProps<Theme> = {
          [themePropName as 'theme']: theme.theme as Theme,
          ref: wrappedRef,
        };

        return <WrappedComponent {...props as any} {...extraProps} />;
      }

      hoistNonReactStatics(WithTheme, WrappedComponent);

      WithTheme.displayName = `withTheme(${baseName})`;

      WithTheme.WrappedComponent = WrappedComponent;

      return WithTheme;
    };
  };
}
