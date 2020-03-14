import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useTheme from './useTheme';
import { WithThemeWrappedProps, WrapperProps, WrapperComponent } from './types';

/**
 * Wrap a React component with an HOC that injects the current theme object as a prop.
 */
export default function withTheme() /* infer */ {
  return function withThemeComposer<Props extends object = {}>(
    WrappedComponent: React.ComponentType<Props & WithThemeWrappedProps>,
  ): React.FunctionComponent<Props & WrapperProps> & WrapperComponent {
    function WithTheme({ wrappedRef, ...props }: Props & WrapperProps) {
      const theme = useTheme();

      return <WrappedComponent {...(props as any)} ref={wrappedRef} theme={theme} />;
    }

    hoistNonReactStatics(WithTheme, WrappedComponent);

    WithTheme.displayName = `withTheme(${WrappedComponent.displayName || WrappedComponent.name})`;

    WithTheme.WrappedComponent = WrappedComponent;

    return WithTheme;
  };
}
