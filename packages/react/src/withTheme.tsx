import React, { useContext } from 'react';
import aesthetic from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import ThemeContext from './ThemeContext';
import { WithThemeOptions, WithThemeWrappedProps, WithThemeWrapperProps } from './types';

/**
 * Wrap a React component with an HOC that injects the current theme object as a prop.
 */
export default function withTheme(options: WithThemeOptions = {}) /* infer */ {
  const { themePropName = aesthetic.options.themePropName } = options;

  return function withThemeComposer<Props extends object = {}>(
    WrappedComponent: React.ComponentType<Props & WithThemeWrappedProps>,
  ): React.FunctionComponent<Props & WithThemeWrapperProps> {
    const baseName = WrappedComponent.displayName || WrappedComponent.name;

    function WithTheme({ wrappedRef, ...props }: Props & WithThemeWrapperProps) {
      const themeName = useContext(ThemeContext);
      const extraProps: WithThemeWrappedProps = {
        [themePropName as 'theme']: aesthetic.getTheme(themeName),
        ref: wrappedRef,
      };

      return <WrappedComponent {...(props as any)} {...extraProps} />;
    }

    hoistNonReactStatics(WithTheme, WrappedComponent);

    WithTheme.displayName = `withTheme(${baseName})`;

    WithTheme.WrappedComponent = WrappedComponent;

    return WithTheme;
  };
}
