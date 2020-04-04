import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useDirection from './useDirection';
import { WithDirectionWrappedProps, WrapperProps, WrapperComponent } from './types';

/**
 * Wrap a React component with an HOC that injects the current direction object as a prop.
 */
export default function withDirection() /* infer */ {
  return function withDirectionComposer<Props extends object = {}>(
    WrappedComponent: React.ComponentType<Props & WithDirectionWrappedProps>,
  ): React.FunctionComponent<Props & WrapperProps> & WrapperComponent {
    function WithDirection({ wrappedRef, ...props }: Props & WrapperProps) {
      const direction = useDirection();

      return <WrappedComponent {...(props as any)} ref={wrappedRef} direction={direction} />;
    }

    hoistNonReactStatics(WithDirection, WrappedComponent);

    WithDirection.displayName = `withDirection(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;

    WithDirection.WrappedComponent = WrappedComponent;

    return WithDirection;
  };
}
