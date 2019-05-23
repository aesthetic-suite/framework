import React from 'react';
import Aesthetic, { StyleSheetDefinition } from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import uuid from 'uuid/v4';
import { Omit } from 'utility-types';
import {
  WithStylesOptions,
  WithStylesState,
  WithStylesProps,
  WithStylesWrapperProps,
  StyledComponentClass,
} from './types';

/**
 * Wrap a React component with an HOC that injects the defined style sheet as a prop.
 */
export default function withStylesFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  return function withStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    options: WithStylesOptions = {},
  ) /* infer */ {
    const {
      extendable = aesthetic.options.extendable,
      extendFrom = '',
      passThemeProp = aesthetic.options.passThemeProp,
      pure = aesthetic.options.pure,
      stylesPropName = aesthetic.options.stylesPropName,
      themePropName = aesthetic.options.themePropName,
    } = options;

    return function withStylesComposer<Props extends object = {}>(
      WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
    ): StyledComponentClass<Theme, Props & WithStylesWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const styleName = `${baseName}-${uuid()}`;
      const Component = pure ? React.PureComponent : React.Component;

      type OwnState = WithStylesState<Props, ParsedBlock>;

      aesthetic.setStyleSheet(styleName, styleSheet, extendFrom);

      class WithStyles extends Component<Props & WithStylesWrapperProps, OwnState> {
        static displayName = `withStyles(${baseName})`;

        static styleName = styleName;

        static WrappedComponent = WrappedComponent;

        static extendStyles<ET>(
          customStyleSheet: StyleSheetDefinition<Theme, ET>,
          extendOptions: Omit<WithStylesOptions, 'extendFrom'> = {},
        ) {
          if (__DEV__) {
            if (!extendable) {
              throw new Error(`${baseName} is not extendable.`);
            }
          }

          return withStyles(customStyleSheet, {
            ...options,
            ...extendOptions,
            extendFrom: styleName,
          })(WrappedComponent);
        }

        // eslint-disable-next-line @typescript-eslint/member-ordering
        constructor(props: Props & WithStylesWrapperProps) {
          super(props);

          this.state = {
            styles: aesthetic.createStyleSheet(styleName),
          };
        }

        componentDidMount() {
          aesthetic.flushStyles(styleName);
        }

        render() {
          const { wrappedRef, ...props } = this.props;
          const extraProps: WithStylesProps<Theme, ParsedBlock> = {
            [stylesPropName as 'styles']: this.state.styles,
            ref: wrappedRef,
          };

          if (passThemeProp) {
            extraProps[themePropName as 'theme'] = aesthetic.getTheme();
          }

          return React.createElement(WrappedComponent, {
            ...props,
            ...extraProps,
          } as any);
        }
      }

      hoistNonReactStatics(WithStyles, WrappedComponent);

      return WithStyles;
    };
  };
}
