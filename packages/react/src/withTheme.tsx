import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useTheme from './useTheme';
import { WithThemeWrappedProps, WithThemeWrapperProps, WrapperComponent } from './types';

/**
 * Wrap a React component with an HOC that injects the current theme object as a prop.
 */
export default function withTheme<Props extends object = {}>(
  WrappedComponent: React.ComponentType<Props & WithThemeWrappedProps>,
): React.FunctionComponent<Props & WithThemeWrapperProps> &
  WrapperComponent<Props & WithThemeWrappedProps> {
  const baseName = WrappedComponent.displayName || WrappedComponent.name;

  function WithTheme({ wrappedRef, ...props }: Props & WithThemeWrapperProps) {
    const theme = useTheme();

    return <WrappedComponent {...(props as any)} ref={wrappedRef} theme={theme} />;
  }

  hoistNonReactStatics(WithTheme, WrappedComponent);

  WithTheme.displayName = `withTheme(${baseName})`;

  WithTheme.WrappedComponent = WrappedComponent;

  return WithTheme;
}
