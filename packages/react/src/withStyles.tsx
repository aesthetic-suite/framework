import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { LocalSheet, StringOnly } from '@aesthetic/core';
import useStyles from './useStyles';
import { WithStylesWrappedProps, WithStylesWrapperProps, WrapperComponent } from './types';

/**
 * Wrap a React component with an HOC that injects the style to class name transfer function.
 */
export default function withStyles<T = unknown>(factory: LocalSheet<T>) /* infer */ {
  type StringKeys = StringOnly<keyof T>;

  return function withStylesComposer<Props extends object = {}>(
    WrappedComponent: React.ComponentType<Props & WithStylesWrappedProps<StringKeys>>,
  ): React.NamedExoticComponent<Props & WithStylesWrapperProps> & WrapperComponent {
    const WithStyles = React.memo(function WithStyles({
      wrappedRef,
      ...props
    }: Props & WithStylesWrapperProps) {
      const cx = useStyles(factory);

      return <WrappedComponent {...(props as any)} cx={cx} ref={wrappedRef} />;
    }) as ReturnType<typeof withStylesComposer>;

    hoistNonReactStatics(WithStyles, WrappedComponent);

    WithStyles.displayName = `withStyles(${WrappedComponent.displayName || WrappedComponent.name})`;

    WithStyles.WrappedComponent = WrappedComponent;

    return WithStyles;
  };
}